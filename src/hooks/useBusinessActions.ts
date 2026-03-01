import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Business } from '@/types/business';

/**
 * Custom hook for business-related user actions.
 * Encapsulates navigation and authentication-dependent actions.
 * 
 * @returns Action handlers for business interactions
 */
export function useBusinessActions() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleViewProfile = (business: Business) => {
    // TODO: Navigate to business profile page when implemented
    console.log('View profile for:', business.name);
    toast.info(`Viewing ${business.name} (profile page coming soon)`);
  };

  const handleAddBusiness = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add a business');
      return;
    }
    navigate('/add-business');
  };

  return {
    handleViewProfile,
    handleAddBusiness,
  };
}
