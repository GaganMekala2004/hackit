import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Ensure react-router is installed.

const PatientProfile: React.FC = () => {
  const navigate = useNavigate(); // For navigation to the login page

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingConditions, setIsEditingConditions] = useState(false);
  const [isEditingMedications, setIsEditingMedications] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Jane Doe',
    age: '42',
    phone: '(555) 123-4567',
    email: 'jane.doe@example.com',
    address: '123 Main St, Anytown, USA',
    dob: 'January 15, 1982',
  });

  const [newProfile, setNewProfile] = useState(profile);

  const [medicalConditions, setMedicalConditions] = useState([
    'Type 2 Diabetes',
    'Hypertension',
    'Osteoarthritis',
  ]);

  const [currentMedications, setCurrentMedications] = useState([
    'Metformin 500mg twice daily',
    'Lisinopril 10mg once daily',
    'Acetaminophen 500mg as needed for pain',
  ]);

  const [editingConditionIndex, setEditingConditionIndex] = useState<number | null>(null);
  const [editingMedicationIndex, setEditingMedicationIndex] = useState<number | null>(null);

  const handleSaveProfile = () => {
    setProfile(newProfile);
    setIsEditingProfile(false);
  };

  const handleAddCondition = () => {
    setMedicalConditions([...medicalConditions, 'New Condition']);
    setEditingConditionIndex(medicalConditions.length); // Start editing new entry
  };

  const handleAddMedication = () => {
    setCurrentMedications([...currentMedications, 'New Medication']);
    setEditingMedicationIndex(currentMedications.length); // Start editing new entry
  };

  const handleDeleteCondition = (index: number) => {
    setMedicalConditions((prev) => prev.filter((_, i) => i !== index));
    setEditingConditionIndex(null); // Reset editing index
  };

  const handleDeleteMedication = (index: number) => {
    setCurrentMedications((prev) => prev.filter((_, i) => i !== index));
    setEditingMedicationIndex(null); // Reset editing index
  };

  const handleLogout = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-6 flex justify-between items-center">
        Patient Profile
        <button
          className="border border-blue-500 text-blue-500 rounded px-1.5 py-0.5 text-sm hover:bg-blue-500 hover:text-white transition"
          onClick={() => {
            if (isEditingProfile) handleSaveProfile();
            else setIsEditingProfile(true);
          }}
        >
          {isEditingProfile ? 'Save' : 'Edit'}
        </button>
      </h1>

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 mb-6 md:mb-0">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
            alt="Patient"
            className="rounded-full w-48 h-48 object-cover mx-auto"
          />
        </div>
        <div className="md:w-2/3 md:pl-8">
          {isEditingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(newProfile).map((key) => (
                <input
                  key={key}
                  type="text"
                  value={newProfile[key as keyof typeof newProfile]}
                  onChange={(e) =>
                    setNewProfile({ ...newProfile, [key]: e.target.value })
                  }
                  className="border border-gray-300 rounded p-2 w-full"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileItem icon={<User />} label="Name" value={profile.name} />
              <ProfileItem icon={<User />} label="Age" value={profile.age} />
              <ProfileItem icon={<Phone />} label="Phone" value={profile.phone} />
              <ProfileItem icon={<Mail />} label="Email" value={profile.email} />
              <ProfileItem icon={<MapPin />} label="Address" value={profile.address} />
              <ProfileItem icon={<Calendar />} label="Date of Birth" value={profile.dob} />
            </div>
          )}
        </div>
      </div>

      <Section
        title="Medical Conditions"
        items={medicalConditions}
        isEditing={isEditingConditions}
        editingIndex={editingConditionIndex}
        onEdit={(index) => setEditingConditionIndex(index)}
        onChange={(index, value) => {
          const updated = [...medicalConditions];
          updated[index] = value;
          setMedicalConditions(updated);
        }}
        onSave={() => setIsEditingConditions((prev) => !prev)}
        onAdd={handleAddCondition}
        onDelete={handleDeleteCondition}
      />

      <Section
        title="Current Medications"
        items={currentMedications}
        isEditing={isEditingMedications}
        editingIndex={editingMedicationIndex}
        onEdit={(index) => setEditingMedicationIndex(index)}
        onChange={(index, value) => {
          const updated = [...currentMedications];
          updated[index] = value;
          setCurrentMedications(updated);
        }}
        onSave={() => setIsEditingMedications((prev) => !prev)}
        onAdd={handleAddMedication}
        onDelete={handleDeleteMedication}
      />

      {/* Logout Button */}
      <div className="flex justify-center mt-10">
        <button
          className="border border-red-500 text-red-500 rounded px-3 py-1 text-sm hover:bg-red-500 hover:text-white transition"
          onClick={handleLogout}
        >
          <LogOut className="inline mr-1" /> Logout
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{
  title: string;
  items: string[];
  isEditing: boolean;
  editingIndex: number | null;
  onEdit: (index: number) => void;
  onChange: (index: number, value: string) => void;
  onSave: () => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}> = ({ title, items, isEditing, editingIndex, onEdit, onChange, onSave, onAdd, onDelete }) => (
  <div className="mt-8">
    <h3 className="text-xl font-semibold mb-4 flex justify-between items-center">
      {title}
      <div>
        <button
          className="border border-green-500 text-green-500 rounded px-1.5 py-0.5 text-sm hover:bg-green-500 hover:text-white transition mr-2"
          onClick={onSave}
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
        {isEditing && (
          <button
            className="border border-blue-500 text-blue-500 rounded px-1.5 py-0.5 text-sm hover:bg-blue-500 hover:text-white transition"
            onClick={onAdd}
          >
            Add
          </button>
        )}
      </div>
    </h3>

    <div className="grid grid-cols-1 gap-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`border p-4 rounded-lg ${
            isEditing && editingIndex === index ? 'bg-gray-50 shadow-sm' : 'bg-white'
          }`}
          onClick={() => isEditing && onEdit(index)}
        >
          {isEditing && editingIndex === index ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={item}
                onChange={(e) => onChange(index, e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
              />
              <button
                className="border border-red-500 text-red-500 rounded px-2 py-1 text-sm hover:bg-red-500 hover:text-white transition"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering edit mode
                  onDelete(index);
                }}
              >
                Delete
              </button>
            </div>
          ) : (
            <p className="text-gray-800 font-medium">{item}</p>
          )}
        </div>
      ))}
    </div>
  </div>
);

const ProfileItem: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center space-x-2">
    <div className="text-gray-500">{icon}</div>
    <div>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  </div>
);

export default PatientProfile;
