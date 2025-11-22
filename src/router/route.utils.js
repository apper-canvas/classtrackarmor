// Route configuration utilities for pattern matching and access verification
const customFunctions = {};

/**
 * Get route configuration for a given path
 * @param {string} path - The route path to check
 * @returns {object|null} - Route configuration or null if not found
 */
// Import routes configuration at the top
import routes from './routes.json';

export function getRouteConfig(path) {
  try {
    // Find matching route pattern
    if (!routes || Object.keys(routes).length === 0) {
      return null;
    }
    
    // Find the best matching pattern
    const patterns = Object.keys(routes);
    let bestMatch = null;
    let highestSpecificity = -1;
    
    for (const pattern of patterns) {
      if (matchesPattern(path, pattern)) {
        const specificity = getSpecificity(pattern);
        if (specificity > highestSpecificity) {
          highestSpecificity = specificity;
          bestMatch = pattern;
        }
      }
    }
    
    return bestMatch ? routes[bestMatch] : null;
  } catch (error) {
    console.warn('Routes configuration not found');
    return null;
  }
}

/**
 * Verify if a user has access to a route based on its configuration
 * @param {object} config - Route configuration
 * @param {object} user - User object
 * @returns {object} - Access verification result
 */
export function verifyRouteAccess(config, user) {
  // Default allow access if no config
  if (!config || !config.allow) {
    return {
      allowed: true,
      redirectTo: null,
      excludeRedirectQuery: false,
      failed: []
    };
  }

  const { allow } = config;
  const { when, redirectOnDeny, excludeRedirectQuery } = allow;

  if (!when || !when.conditions) {
    return {
      allowed: true,
      redirectTo: null,
      excludeRedirectQuery: false,
      failed: []
    };
  }

  const { conditions, operator = 'AND' } = when;
  const failed = [];
  let results = [];

  for (const condition of conditions) {
    const { rule, label } = condition;
    let conditionResult = false;

    switch (rule) {
      case 'public':
        conditionResult = true;
        break;
      case 'authenticated':
        conditionResult = !!user;
break;
      case 'admin':
        // Admin role access - requires authentication and ADMIN role
        conditionResult = user && user.roleCode === 'ADMIN';
        break;
      case 'ceo':
        // CEO role access - requires authentication and CEO role
        conditionResult = user && user.roleCode === 'CEO';
        break;
      case 'manager':
        // Manager role access - requires authentication and MANAGER role (or higher)
        conditionResult = user && (user.roleCode === 'CEO' || user.roleCode === 'MANAGER');
        break;
      case 'user':
        // User role access - requires authentication and any valid role
        conditionResult = user && ['CEO', 'MANAGER', 'USER'].includes(user.roleCode);
        break;
      default:
        console.warn(`Unknown rule: ${rule}`);
        conditionResult = false;
    }

    results.push(conditionResult);
    
    if (!conditionResult) {
      failed.push(label || rule);
    }
  }

  // Apply operator logic
  let allowed;
  if (operator === 'OR') {
    allowed = results.some(result => result);
  } else {
    allowed = results.every(result => result);
  }

  return {
    allowed,
    redirectTo: allowed ? null : redirectOnDeny,
    excludeRedirectQuery: excludeRedirectQuery || false,
    failed
  };
}

/**
 * Check if a path matches a pattern
 * @param {string} path - The actual path
 * @param {string} pattern - The pattern to match against
 * @returns {boolean} - Whether the path matches the pattern
 */
export function matchesPattern(path, pattern) {
  // Exact match
  if (path === pattern) return true;

  // Convert pattern to regex
  const regexPattern = pattern
    .replace(/:\w+/g, '([^/]+)') // Parameter segments
    .replace(/\/\*\*/g, '(/.*)?') // Wildcard segments
    .replace(/\/\*/g, '/([^/]+)'); // Single wildcard

  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(path);
}

/**
 * Get specificity score for pattern matching priority
 * @param {string} pattern - The pattern to score
 * @returns {number} - Specificity score (higher = more specific)
 */
export function getSpecificity(pattern) {
  let score = 0;
  
  // Exact segments get highest score
  const segments = pattern.split('/');
  for (const segment of segments) {
    if (segment && !segment.includes(':') && !segment.includes('*')) {
      score += 3;
    } else if (segment.startsWith(':')) {
      score += 2; // Parameter segments
    } else if (segment === '*') {
      score += 1; // Single wildcard
    } else if (segment === '**') {
      score += 0; // Multi-level wildcard gets lowest priority
    }
  }
  
  return score;
}