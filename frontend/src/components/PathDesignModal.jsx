import { useState } from 'react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { Target, Clock, Briefcase, User } from 'lucide-react';

export default function PathDesignModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    occupation: '',
    goal: 'communication', // communication, toeic, ielts
    band: '', // For toeic/ielts
    studyTime: '30', // minutes
  });

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onSave(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Design Your Learning Path" size="md">
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-colors ${
                step >= i ? 'bg-accent' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg mb-2">Tell us about yourself</h4>
            <Input
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g., 22"
              icon={User}
            />
            <Input
              label="Occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="e.g., Student, Engineer"
              icon={Briefcase}
            />
          </div>
        )}

        {/* Step 2: Goal */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg mb-2">What is your primary goal?</h4>
            <div className="grid gap-3">
              {[
                { id: 'communication', label: 'Communication (Giao tiếp)' },
                { id: 'toeic', label: 'TOEIC' },
                { id: 'ielts', label: 'IELTS' },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => setFormData({ ...formData, goal: goal.id, band: '' })}
                  className={`
                    p-4 rounded-[var(--radius-md)] border-2 text-left font-bold transition-all
                    ${formData.goal === goal.id 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-border bg-card hover:border-muted-foreground'
                    }
                  `}
                >
                  {goal.label}
                </button>
              ))}
            </div>

            {(formData.goal === 'toeic' || formData.goal === 'ielts') && (
              <div className="mt-4 animate-[fade-in_0.3s_ease-out]">
                <label className="block text-sm font-bold mb-2">Target Band / Score</label>
                <select
                  name="band"
                  value={formData.band}
                  onChange={handleChange}
                  className="w-full h-11 px-4 rounded-[var(--radius-md)] border-2 border-border bg-card text-foreground font-semibold focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="" disabled>Select target...</option>
                  {formData.goal === 'toeic' ? (
                    <>
                      <option value="450">450+</option>
                      <option value="600">600+</option>
                      <option value="750">750+</option>
                      <option value="900">900+</option>
                    </>
                  ) : (
                    <>
                      <option value="5.0">5.0+</option>
                      <option value="6.0">6.0+</option>
                      <option value="7.0">7.0+</option>
                      <option value="8.0">8.0+</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Commitment */}
        {step === 3 && (
          <div className="space-y-4">
            <h4 className="font-heading font-bold text-lg mb-2">Daily Commitment</h4>
            <p className="text-muted-foreground text-sm">How much time can you study per day?</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: '15', label: '15 mins' },
                { val: '30', label: '30 mins' },
                { val: '60', label: '1 hour' },
                { val: '120', label: '2 hours' },
              ].map((time) => (
                <button
                  key={time.val}
                  onClick={() => setFormData({ ...formData, studyTime: time.val })}
                  className={`
                    p-3 rounded-[var(--radius-md)] border-2 text-center font-bold flex flex-col items-center gap-2 transition-all
                    ${formData.studyTime === time.val 
                      ? 'border-accent bg-accent/10 text-accent' 
                      : 'border-border bg-card hover:border-muted-foreground'
                    }
                  `}
                >
                  <Clock size={24} />
                  {time.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between pt-6 mt-4 border-t border-border">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={
              (step === 1 && (!formData.age || !formData.occupation)) ||
              (step === 2 && (formData.goal !== 'communication' && !formData.band))
            }
          >
            {step === 3 ? 'Save Path' : 'Continue'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
