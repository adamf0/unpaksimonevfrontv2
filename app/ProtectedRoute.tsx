import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import apiCall from "./Module/Common/External/APICall";
import { getRolesFromToken } from "./Module/Common/Service/tokenExpiry";
import {
  ADMIN_GROUP_ALIASES,
  FAKULTAS_GROUP_ALIASES,
  PRODI_GROUP_ALIASES,
  DEFAULT_ALLOWED_LEVELS,
} from "./Module/Common/Const/authRoles";

interface ProtectedRouteProps {
  allowedLevels?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedLevels = DEFAULT_ALLOWED_LEVELS,
  redirectTo = '/login?r=F0',
}) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiCall.get("/whoami");
        const data = response.data;
        const userLevel = data?.Level ? data.Level.toLowerCase().trim() : '';

        const token = sessionStorage.getItem("access_token") || localStorage.getItem("access_token");
        const tokenRoles = getRolesFromToken(token);

        let isAllowed = allowedLevels.some(
          (level) => userLevel === level.toLowerCase() || userLevel.includes(level.toLowerCase())
        );

        if (!isAllowed && tokenRoles.length > 0) {
          const normAllowed = allowedLevels.map((l) => l.toLowerCase());
          const hasAdminAccess = tokenRoles.some((r) => ADMIN_GROUP_ALIASES.includes(r));
          const hasFakultasAccess = tokenRoles.some((r) => FAKULTAS_GROUP_ALIASES.includes(r));
          const hasProdiAccess = tokenRoles.some((r) => PRODI_GROUP_ALIASES.includes(r));

          if (hasAdminAccess && normAllowed.includes("admin")) {
            isAllowed = true;
          } else if (hasFakultasAccess && normAllowed.includes("fakultas")) {
            isAllowed = true;
          } else if (hasProdiAccess && normAllowed.includes("prodi")) {
            isAllowed = true;
          } else if (tokenRoles.some((r) => normAllowed.includes(r))) {
            isAllowed = true;
          }
        }

        setIsAuthorized(isAllowed);
      } catch (error) {
        console.error('Auth Check Error:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [allowedLevels]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>Memuat data pengguna...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
