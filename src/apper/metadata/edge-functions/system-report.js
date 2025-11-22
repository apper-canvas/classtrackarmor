import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    const url = new URL(req.url);
    const reportType = url.searchParams.get('type') || 'overview';
    
    // Get comprehensive system data
    const [companies, sites, users, roles, featureAreas] = await Promise.all([
      apperClient.fetchRecords('company_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Id_c"}},
          {"field": {"Name": "nameEn_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      }),
      apperClient.fetchRecords('site_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Id_c"}},
          {"field": {"Name": "nameEn_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "companyId_c"}},
          {"field": {"Name": "managerId_c"}}
        ]
      }),
      apperClient.fetchRecords('user_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Id_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "roleId_c"}},
          {"field": {"Name": "siteId_c"}},
          {"field": {"Name": "lastLoginAt_c"}}
        ]
      }),
      apperClient.fetchRecords('role_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Id_c"}},
          {"field": {"Name": "code_c"}},
          {"field": {"Name": "scopeLevel_c"}},
          {"field": {"Name": "isSystemRole_c"}}
        ]
      }),
      apperClient.fetchRecords('regulatory_alignment_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "feature_area_c"}},
          {"field": {"Name": "compliance_objectives_c"}},
          {"field": {"Name": "relevant_moroccan_laws_c"}}
        ]
      })
    ]);

    // Check for API errors
    if (!companies.success || !sites.success || !users.success || !roles.success || !featureAreas.success) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Failed to fetch system data'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const systemReport = {
      reportType,
      generatedAt: new Date().toISOString(),
      summary: {
        totalCompanies: companies.data?.length || 0,
        totalSites: sites.data?.length || 0,
        totalUsers: users.data?.length || 0,
        totalRoles: roles.data?.length || 0,
        totalFeatureAreas: featureAreas.data?.length || 0,
        activeUsers: users.data?.filter(u => u.status_c === 'active').length || 0,
        pendingInvitations: users.data?.filter(u => u.status_c === 'invited').length || 0,
        activeSites: sites.data?.filter(s => s.status_c === 'active').length || 0,
        activeCompanies: companies.data?.filter(c => c.status_c === 'active').length || 0
      }
    };

    // Add detailed data based on report type
    switch (reportType) {
      case 'overview':
        systemReport.details = {
          companiesBreakdown: companies.data?.map(c => ({
            id: c.Id_c,
            name: c.nameEn_c || c.Name,
            status: c.status_c,
            createdOn: c.CreatedOn
          })) || [],
          sitesBreakdown: sites.data?.map(s => ({
            id: s.Id_c,
            name: s.nameEn_c || s.Name,
            status: s.status_c,
            companyId: s.companyId_c?.Id || s.companyId_c,
            managerId: s.managerId_c?.Id || s.managerId_c
          })) || [],
          usersBreakdown: users.data?.map(u => ({
            id: u.Id_c,
            email: u.email_c,
            status: u.status_c,
            roleId: u.roleId_c?.Id || u.roleId_c,
            siteId: u.siteId_c?.Id || u.siteId_c,
            lastLogin: u.lastLoginAt_c
          })) || []
        };
        break;

      case 'compliance':
        systemReport.compliance = {
          featureAreas: featureAreas.data?.map(fa => ({
            name: fa.Name,
            area: fa.feature_area_c,
            hasObjectives: !!fa.compliance_objectives_c,
            hasLaws: !!fa.relevant_moroccan_laws_c,
            complianceScore: (fa.compliance_objectives_c ? 50 : 0) + (fa.relevant_moroccan_laws_c ? 50 : 0)
          })) || [],
          overallComplianceScore: featureAreas.data?.length > 0 ? 
            Math.round(featureAreas.data.reduce((acc, fa) => {
              const score = (fa.compliance_objectives_c ? 50 : 0) + (fa.relevant_moroccan_laws_c ? 50 : 0);
              return acc + score;
            }, 0) / featureAreas.data.length) : 0
        };
        break;

      case 'rbac':
        systemReport.rbac = {
          roles: roles.data?.map(r => ({
            id: r.Id_c,
            name: r.Name,
            code: r.code_c,
            scopeLevel: r.scopeLevel_c,
            isSystemRole: r.isSystemRole_c,
            userCount: users.data?.filter(u => 
              (u.roleId_c?.Id || u.roleId_c) === r.Id_c
            ).length || 0
          })) || [],
          permissionMatrix: {
            ceo: { scope: 'all', resources: ['companies', 'sites', 'users', 'workflows'] },
            manager: { scope: 'site', resources: ['sites', 'users', 'workflows'] },
            user: { scope: 'own', resources: ['users', 'workflows'] }
          }
        };
        break;

      default:
        return new Response(JSON.stringify({
          success: false,
          message: 'Invalid report type. Use: overview, compliance, or rbac'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify({
      success: true,
      data: systemReport
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