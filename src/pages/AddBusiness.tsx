import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { useCreateBusiness } from '@/hooks/useBusinesses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';

const AddBusiness = () => {
  const navigate = useNavigate();
  const createBusiness = useCreateBusiness();
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createBusiness.mutateAsync({
        businessId: `business-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        description: formData.description,
      });
      
      toast.success('Business created successfully!');
      navigate('/browse');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create business');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/browse')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Browse
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Add New Business</CardTitle>
            <CardDescription>
              Add a business to the directory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Technology, Healthcare, Retail"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the business..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createBusiness.isPending}
              >
                {createBusiness.isPending ? 'Creating...' : 'Create Business'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddBusiness;
