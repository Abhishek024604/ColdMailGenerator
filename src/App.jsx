import { useState } from 'react';
import '@/App.css';
import { motion } from 'framer-motion';
import { Zap, Copy, Terminal, Send } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Analytics } from '@vercel/analytics/react';

const emailTemplates = {
  formal: (data) => ({
    subject: `Application for ${data.role} Opportunity at ${data.company}`,
    body: `Hi ${data.recipient || 'Hiring Team'},

I hope you are doing well. My name is ${data.name}, and I am a ${data.role} with experience in ${data.skills || 'relevant technologies'}.

I recently came across ${data.company} and was impressed by your work. I would like to express my interest in exploring potential opportunities with your team.

I would be grateful if you could consider my application or guide me regarding any relevant openings.
I am attaching my resume for your reference.

Thank you for your time and consideration.

Best regards,
${data.name}`
  }),
  friendly: (data) => ({
    subject: `Interested in working with ${data.company}`,
    body: `Hi ${data.recipient || 'Hiring Team'},

I'm ${data.name}, a ${data.role} who enjoys working with ${data.skills || 'relevant technologies'}. I recently discovered ${data.company} and really liked what you're building.

I'd love to connect and explore if there's any opportunity to contribute or collaborate.

I am attaching my resume for your reference.

Looking forward to hearing from you.

Thanks,
${data.name}`
  }),
  direct: (data) => ({
    subject: `${data.role} | Opportunity at ${data.company}`,
    body: `Hi ${data.recipient || 'Hiring Team'},

I'm ${data.name}, a ${data.role} skilled in ${data.skills || 'relevant technologies'}.

I'm reaching out to check if there are any open opportunities at ${data.company}. I'd be interested in contributing immediately.

Please let me know if we can connect.

Attaching my resume for your reference.

Best,
${data.name}`
  })
};

function App() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    recipient: '',
    purpose: '',
    skills: '',
    tone: 'formal'
  });

  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [editableSubject, setEditableSubject] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.purpose) newErrors.purpose = 'Purpose is required';
    return newErrors;
  };

  const generateEmail = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    const template = emailTemplates[formData.tone];
    const email = template(formData);
    setGeneratedEmail(email);
    setEditableSubject(email.subject);
    setEditableBody(email.body);
    toast.success('Email generated successfully!');
  };

  const copyToClipboard = async () => {
    const fullEmail = `Subject: ${editableSubject}\n\n${editableBody}`;
    
    try {
      // Try modern clipboard API first
      await navigator.clipboard.writeText(fullEmail);
      toast.success('Email copied to clipboard!');
    } catch (err) {
      // Fallback method for environments without clipboard permissions
      try {
        const textArea = document.createElement('textarea');
        textArea.value = fullEmail;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          toast.success('Email copied to clipboard!');
        } else {
          toast.error('Failed to copy. Please copy manually.');
        }
      } catch (fallbackErr) {
        toast.error('Failed to copy. Please copy manually.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#030105] relative overflow-hidden">
       <Analytics />
      <Toaster 
        theme="dark" 
        position="top-center"
        toastOptions={{
          style: {
            background: '#0C0614',
            border: '1px solid rgba(255, 69, 0, 0.3)',
            color: '#FAFAFA',
          },
        }}
      />
      
      {/* Background Image with Heavy Overlay */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1729722615809-45b3f2ad1747?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwzfHxvcmFuZ2UlMjBnYWxheHklMjBzdXBlcm5vdmElMjBzcGFjZXxlbnwwfHx8fDE3NzQ1NDgxNTN8MA&ixlib=rb-4.1.0&q=85)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-black/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-12 md:px-12 lg:px-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/5">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-xs tracking-widest uppercase text-orange-500 font-medium">Instant Email Generation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter mb-4" style={{ fontFamily: 'Unbounded' }}>
            <span className="bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 bg-clip-text text-transparent">
              Write cold emails that
            </span>
            <br />
            <span className="text-white">actually get replies</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto" style={{ fontFamily: 'Outfit' }}>
            Generate professional emails in seconds. No AI complexity, just clean templates that work.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-[#0C0614]/60 backdrop-blur-2xl border border-orange-500/20 rounded-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Terminal className="w-5 h-5 text-orange-500" />
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Unbounded' }}>Input Details</h2>
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300 text-sm font-medium">Your Name *</Label>
                  <Input
                    id="name"
                    data-testid="name-input"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="John Doe"
                    className="bg-[#030105] border-orange-500/30 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                  />
                  {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-zinc-300 text-sm font-medium">Your Role *</Label>
                  <Input
                    id="role"
                    data-testid="role-input"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    placeholder="Frontend Developer"
                    className="bg-[#030105] border-orange-500/30 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                  />
                  {errors.role && <p className="text-xs text-red-400">{errors.role}</p>}
                </div>

                {/* Company */}
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-zinc-300 text-sm font-medium">Target Company *</Label>
                  <Input
                    id="company"
                    data-testid="company-input"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Google"
                    className="bg-[#030105] border-orange-500/30 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                  />
                  {errors.company && <p className="text-xs text-red-400">{errors.company}</p>}
                </div>

                {/* Recipient */}
                <div className="space-y-2">
                  <Label htmlFor="recipient" className="text-zinc-300 text-sm font-medium">Recipient (Optional)</Label>
                  <Input
                    id="recipient"
                    data-testid="recipient-input"
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    placeholder="Hiring Team"
                    className="bg-[#030105] border-orange-500/30 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                  />
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-zinc-300 text-sm font-medium">Purpose *</Label>
                  <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                    <SelectTrigger 
                      data-testid="purpose-selector"
                      className="bg-[#030105] border-orange-500/30 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                    >
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0614] border-orange-500/30 text-white">
                      <SelectItem value="internship" className="focus:bg-orange-500/20 focus:text-white">Internship</SelectItem>
                      <SelectItem value="referral" className="focus:bg-orange-500/20 focus:text-white">Referral</SelectItem>
                      <SelectItem value="job" className="focus:bg-orange-500/20 focus:text-white">Job Application</SelectItem>
                      <SelectItem value="collaboration" className="focus:bg-orange-500/20 focus:text-white">Collaboration</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.purpose && <p className="text-xs text-red-400">{errors.purpose}</p>}
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-zinc-300 text-sm font-medium">Skills (Optional)</Label>
                  <Input
                    id="skills"
                    data-testid="skills-input"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="React, Node.js, Python"
                    className="bg-[#030105] border-orange-500/30 text-white placeholder:text-zinc-600 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                  />
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-zinc-300 text-sm font-medium">Tone</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                    <SelectTrigger 
                      data-testid="tone-selector"
                      className="bg-[#030105] border-orange-500/30 text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0C0614] border-orange-500/30 text-white">
                      <SelectItem value="formal" className="focus:bg-orange-500/20 focus:text-white">Formal</SelectItem>
                      <SelectItem value="friendly" className="focus:bg-orange-500/20 focus:text-white">Friendly</SelectItem>
                      <SelectItem value="direct" className="focus:bg-orange-500/20 focus:text-white">Direct</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                <button
                  data-testid="generate-email-button"
                  onClick={generateEmail}
                  className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-black font-black text-base rounded-md hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,69,0,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Unbounded' }}
                >
                  <Zap className="w-5 h-5" />
                  Generate Email
                </button>
              </div>
            </div>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <div 
              data-testid="email-output-container"
              className="bg-black border-l-4 border-orange-500 rounded-lg p-6 md:p-8 min-h-[600px] shadow-[0_0_30px_rgba(255,69,0,0.15)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <Send className="w-5 h-5 text-orange-500" />
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Unbounded' }}>Generated Email</h2>
              </div>

              {generatedEmail ? (
                <div className="space-y-6">
                  {/* Subject */}
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs tracking-widest uppercase">Subject Line</Label>
                    <Input
                      data-testid="email-subject-output"
                      value={editableSubject}
                      onChange={(e) => setEditableSubject(e.target.value)}
                      className="bg-[#0C0614] border-orange-500/30 text-white font-mono text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 rounded-md"
                      style={{ fontFamily: 'JetBrains Mono' }}
                    />
                  </div>

                  {/* Body */}
                  <div className="space-y-2">
                    <Label className="text-zinc-400 text-xs tracking-widest uppercase">Email Body</Label>
                    <textarea
                      data-testid="email-body-output"
                      value={editableBody}
                      onChange={(e) => setEditableBody(e.target.value)}
                      rows={16}
                      className="w-full bg-[#0C0614] border border-orange-500/30 text-zinc-200 rounded-md p-4 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none resize-none leading-relaxed"
                      style={{ fontFamily: 'JetBrains Mono', fontSize: '14px' }}
                    />
                  </div>

                  {/* Copy Button */}
                  <button
                    data-testid="copy-clipboard-button"
                    onClick={copyToClipboard}
                    className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-600 text-black font-black text-base rounded-md hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(255,69,0,0.4)] transition-all duration-200 flex items-center justify-center gap-2"
                    style={{ fontFamily: 'Unbounded' }}
                  >
                    <Copy className="w-5 h-5" />
                    Copy Email
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center">
                  <Terminal className="w-16 h-16 text-zinc-700 mb-4" />
                  <p className="text-zinc-500 text-lg" style={{ fontFamily: 'Outfit' }}>
                    Fill in the form and click Generate Email to see your professional cold email here.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-zinc-600 text-sm" style={{ fontFamily: 'Outfit' }}>
            Simple. Professional. Effective.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;