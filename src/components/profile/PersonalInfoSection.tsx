
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, MapPin, Target } from "lucide-react";
import { CAREER_FIELDS } from "@/data/onboardingData";

interface PersonalInfoData {
  full_name: string;
  location: string;
  field_of_interest: string;
}

interface PersonalInfoSectionProps {
  isEditing: boolean;
  formData: PersonalInfoData;
  profileEmail: string;
  onFormDataChange: (data: Partial<PersonalInfoData>) => void;
}

const PersonalInfoSection = ({ isEditing, formData, profileEmail, onFormDataChange }: PersonalInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-pathwise-text">
          <User className="mr-2 h-5 w-5 text-teal-600" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="full_name" className="text-gray-400">Full Name</Label>
            {isEditing ? (
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => onFormDataChange({ full_name: e.target.value })}
                className="text-pathwise-text-muted"
              />
            ) : (
              <p className="text-pathwise-text-muted mt-1">{formData.full_name || 'Not provided'}</p>
            )}
          </div>
          <div>
            <Label className="text-gray-400">Email</Label>
            <p className="text-pathwise-text-muted mt-1">{profileEmail || 'Not provided'}</p>
          </div>
          <div>
            <Label htmlFor="location" className="flex items-center text-gray-400">
              <MapPin className="w-4 h-4 mr-1" />
              Location
            </Label>
            {isEditing ? (
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => onFormDataChange({ location: e.target.value })}
                className="text-pathwise-text-muted"
              />
            ) : (
              <p className="text-pathwise-text-muted mt-1">{formData.location || 'Not provided'}</p>
            )}
          </div>
          <div>
            <Label htmlFor="field_of_interest" className="flex items-center text-gray-400">
              <Target className="w-4 h-4 mr-1" />
              Field of Interest
            </Label>
            {isEditing ? (
              <Select value={formData.field_of_interest} onValueChange={(value) => onFormDataChange({ field_of_interest: value })}>
                <SelectTrigger className="text-pathwise-text-muted">
                  <SelectValue placeholder="Select your field of interest" />
                </SelectTrigger>
                <SelectContent>
                  {CAREER_FIELDS.map((field) => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-pathwise-text-muted mt-1">{formData.field_of_interest || 'Not provided'}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoSection;
