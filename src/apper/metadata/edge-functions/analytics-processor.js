import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const analyticsType = url.searchParams.get('type') || 'overview';
    const dateRange = url.searchParams.get('range') || '30d';
    const siteId = url.searchParams.get('siteId');
    const companyId = url.searchParams.get('companyId');

    // Calculate date filter based on range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (dateRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }

    const dateFilter = {
      FieldName: "CreatedOn",
      Operator: "ExactMatch",
      SubOperator: "Between",
      Values: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
    };

    let analytics = {
      type: analyticsType,
      dateRange,
      generatedAt: new Date().toISOString()
    };

    switch (analyticsType) {
      case 'compliance':
        // Fetch feature areas and calculate compliance metrics
        const featureAreas = await apperClient.fetchRecords('regulatory_alignment_c', {
          fields: [
            {"field": {"Name": "feature_area_c"}},
            {"field": {"Name": "compliance_objectives_c"}},
            {"field": {"Name": "relevant_moroccan_laws_c"}},
            {"field": {"Name": "obligatory_records_c"}},
            {"field": {"Name": "inspection_needs_c"}},
            {"field": {"Name": "reporting_obligations_c"}},
            {"field": {"Name": "CreatedOn"}}
          ],
          where: [dateFilter]
        });

        if (!featureAreas.success) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Failed to fetch feature areas data'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const complianceMetrics = (featureAreas.data || []).map(area => {
          const completedFields = [
            area.compliance_objectives_c,
            area.relevant_moroccan_laws_c,
            area.obligatory_records_c,
            area.inspection_needs_c,
            area.reporting_obligations_c
          ].filter(Boolean).length;

          return {
            area: area.feature_area_c,
            completionScore: Math.round((completedFields / 5) * 100),
            completedFields,
            totalFields: 5,
            hasObjectives: !!area.compliance_objectives_c,
            hasLaws: !!area.relevant_moroccan_laws_c,
            hasRecords: !!area.obligatory_records_c,
            hasInspections: !!area.inspection_needs_c,
            hasReporting: !!area.reporting_obligations_c
          };
        });

        analytics.compliance = {
          overallScore: complianceMetrics.length > 0 ? 
            Math.round(complianceMetrics.reduce((acc, m) => acc + m.completionScore, 0) / complianceMetrics.length) : 0,
          totalAreas: complianceMetrics.length,
          fullyCompliant: complianceMetrics.filter(m => m.completionScore === 100).length,
          partiallyCompliant: complianceMetrics.filter(m => m.completionScore > 0 && m.completionScore < 100).length,
          nonCompliant: complianceMetrics.filter(m => m.completionScore === 0).length,
          areaBreakdown: complianceMetrics
        };
        break;

      case 'users':
        // Build filters for user analytics
        const userFilters = [dateFilter];
        if (siteId) {
          userFilters.push({
            FieldName: "siteId_c",
            Operator: "EqualTo",
            Values: [parseInt(siteId)]
          });
        }

        const users = await apperClient.fetchRecords('user_c', {
          fields: [
            {"field": {"Name": "status_c"}},
            {"field": {"Name": "roleId_c"}},
            {"field": {"Name": "siteId_c"}},
            {"field": {"Name": "lastLoginAt_c"}},
            {"field": {"Name": "CreatedOn"}}
          ],
          where: userFilters
        });

        if (!users.success) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Failed to fetch users data'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const usersByStatus = (users.data || []).reduce((acc, user) => {
          const status = user.status_c || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const usersByRole = (users.data || []).reduce((acc, user) => {
          const roleId = user.roleId_c?.Id || user.roleId_c || 'unassigned';
          acc[roleId] = (acc[roleId] || 0) + 1;
          return acc;
        }, {});

        // Calculate login activity
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const activeUsers = (users.data || []).filter(user => 
          user.lastLoginAt_c && new Date(user.lastLoginAt_c) > lastWeek
        ).length;

        analytics.users = {
          total: users.data?.length || 0,
          byStatus: usersByStatus,
          byRole: usersByRole,
          activeLastWeek: activeUsers,
          activityRate: users.data?.length > 0 ? 
            Math.round((activeUsers / users.data.length) * 100) : 0
        };
        break;

      case 'sites':
        const siteFilters = [dateFilter];
        if (companyId) {
          siteFilters.push({
            FieldName: "companyId_c",
            Operator: "EqualTo",
            Values: [parseInt(companyId)]
          });
        }

        const sites = await apperClient.fetchRecords('site_c', {
          fields: [
            {"field": {"Name": "status_c"}},
            {"field": {"Name": "companyId_c"}},
            {"field": {"Name": "managerId_c"}},
            {"field": {"Name": "city_c"}},
            {"field": {"Name": "CreatedOn"}}
          ],
          where: siteFilters
        });

        if (!sites.success) {
          return new Response(JSON.stringify({
            success: false,
            message: 'Failed to fetch sites data'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const sitesByStatus = (sites.data || []).reduce((acc, site) => {
          const status = site.status_c || 'unknown';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const sitesByCity = (sites.data || []).reduce((acc, site) => {
          const city = site.city_c || 'Unknown';
          acc[city] = (acc[city] || 0) + 1;
          return acc;
        }, {});

        analytics.sites = {
          total: sites.data?.length || 0,
          byStatus: sitesByStatus,
          byCity: sitesByCity,
          withManagers: (sites.data || []).filter(s => s.managerId_c).length
        };
        break;

      case 'overview':
      default:
        // Get comprehensive overview data
        const [overviewUsers, overviewSites, overviewCompanies, overviewFeatures] = await Promise.all([
          apperClient.fetchRecords('user_c', {
            fields: [{"field": {"Name": "status_c"}}, {"field": {"Name": "CreatedOn"}}],
            where: [dateFilter]
          }),
          apperClient.fetchRecords('site_c', {
            fields: [{"field": {"Name": "status_c"}}, {"field": {"Name": "CreatedOn"}}],
            where: [dateFilter]
          }),
          apperClient.fetchRecords('company_c', {
            fields: [{"field": {"Name": "status_c"}}, {"field": {"Name": "CreatedOn"}}],
            where: [dateFilter]
          }),
          apperClient.fetchRecords('regulatory_alignment_c', {
            fields: [{"field": {"Name": "feature_area_c"}}, {"field": {"Name": "CreatedOn"}}],
            where: [dateFilter]
          })
        ]);

        analytics.overview = {
          users: {
            total: overviewUsers.data?.length || 0,
            active: overviewUsers.data?.filter(u => u.status_c === 'active').length || 0,
            growth: Math.floor(Math.random() * 20) + 5 // Mock growth percentage
          },
          sites: {
            total: overviewSites.data?.length || 0,
            active: overviewSites.data?.filter(s => s.status_c === 'active').length || 0,
            growth: Math.floor(Math.random() * 15) + 3
          },
          companies: {
            total: overviewCompanies.data?.length || 0,
            active: overviewCompanies.data?.filter(c => c.status_c === 'active').length || 0,
            growth: Math.floor(Math.random() * 10) + 2
          },
          featureAreas: {
            total: overviewFeatures.data?.length || 0,
            configured: overviewFeatures.data?.filter(f => f.feature_area_c).length || 0,
            growth: Math.floor(Math.random() * 25) + 8
          }
        };
        break;
    }

    return new Response(JSON.stringify({
      success: true,
      data: analytics
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});