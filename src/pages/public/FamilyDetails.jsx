import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Calendar, Home, Phone, MapPin, Users, Plus, Trash2, Save,
    FileText, CreditCard, CheckCircle2, Globe
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { useTranslationContext, useTranslate, T } from '../../context/TranslationContext'; // Import Translation Hooks

// Reusable Modern Components
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${className}`}>
        {children}
    </div>
);

const CardHeader = ({ title, icon: Icon, subtitle }) => (
    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        {Icon && <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Icon size={20} /></div>}
        <div>
            <h3 className="font-semibold text-slate-800 text-lg"><T>{title}</T></h3>
            {subtitle && <p className="text-sm text-slate-500"><T>{subtitle}</T></p>}
        </div>
    </div>
);

const Label = ({ children }) => (
    <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1"><T>{children}</T></label>
);

const Input = ({ icon: Icon, value, onChange, placeholder, ...props }) => {
    const translatedPlaceholder = useTranslate(placeholder);
    return (
        <div className="relative group">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                    <Icon size={18} />
                </div>
            )}
            <input
                value={value}
                onChange={onChange}
                placeholder={translatedPlaceholder}
                {...props}
                className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-all outline-none ${Icon ? 'pl-10' : ''} placeholder:text-slate-400`}
            />
        </div>
    );
};

const Select = ({ value, onChange, children, ...props }) => (
    <div className="relative">
        <select
            value={value}
            onChange={onChange}
            {...props}
            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 transition-all outline-none appearance-none cursor-pointer"
        >
            {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
    </div>
);

const FamilyDetails = () => {
    const { currentLang, setCurrentLang } = useTranslationContext();

    // Form State
    const [formData, setFormData] = useState({
        houseId: '',
        date: new Date().toISOString().split('T')[0],
        headName: '',
        nic: '',
        contact: '',
        address: '',
        residency: 'Own',
    });

    const [members, setMembers] = useState([
        { id: 1, name: '', relation: 'Head', age: '', job: '' }
    ]);

    // UI State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMemberChange = (id, field, value) => {
        setMembers(members.map(member =>
            member.id === id ? { ...member, [field]: value } : member
        ));
    };

    const addMember = () => {
        setMembers([...members, { id: Date.now(), name: '', relation: '', age: '', job: '' }]);
    };

    const removeMember = (id) => {
        if (members.length > 1) {
            setMembers(members.filter(m => m.id !== id));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', text: '' });

        // Basic Validation
        if (!formData.headName || !formData.contact) {
            setMessage({ type: 'error', text: 'Please fill in required fields (Name, Contact).' });
            setIsSubmitting(false);
            return;
        }

        try {
            // Create Submission Object
            const submission = {
                id: Date.now(), // Simple ID gen
                ...formData,
                members,
                submittedAt: new Date().toISOString(),
                status: 'Pending'
            };

            // Save to LocalStorage
            const existingSubmissions = JSON.parse(localStorage.getItem('familySubmissions') || '[]');
            localStorage.setItem('familySubmissions', JSON.stringify([submission, ...existingSubmissions]));

            // Reset Form and Show Success
            setTimeout(() => {
                setFormData({
                    houseId: '',
                    date: new Date().toISOString().split('T')[0],
                    headName: '',
                    nic: '',
                    contact: '',
                    address: '',
                    residency: 'Own',
                });
                setMembers([{ id: Date.now(), name: '', relation: 'Head', age: '', job: '' }]);
                setMessage({ type: 'success', text: 'Registration submitted successfully!' });
                setIsSubmitting(false);
            }, 800);

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Failed to submit. Please try again.' });
            setIsSubmitting(false);
        }
    };

    // Translated Options
    const relationOptions = ['Head', 'Wife', 'Son', 'Daughter', 'Father', 'Mother', 'Other'];

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="text-center md:text-left flex-1">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4 text-indigo-700"
                        >
                            <Home size={32} />
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2"><T>Family Registration</T></h1>
                        <p className="text-slate-500 max-w-xl text-lg">
                            <T>Please fill in your family details for the Masjid Al-Taqwa records.</T>
                        </p>
                    </div>

                    {/* Language Selector */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <Globe size={18} />
                        </div>
                        <select
                            value={currentLang}
                            onChange={(e) => setCurrentLang(e.target.value)}
                            className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                        >
                            <option value="en">English</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                            <option value="si">සිංහල (Sinhala)</option>
                        </select>
                    </div>
                </div>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-8"
                    onSubmit={handleSubmit}
                >
                    {/* Meta Information */}
                    <Card>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                            <div>
                                <Label>House ID</Label>
                                <Input
                                    name="houseId"
                                    value={formData.houseId}
                                    onChange={handleInputChange}
                                    placeholder="e.g. H-123"
                                    icon={FileText}
                                />
                            </div>
                            <div>
                                <Label>Date</Label>
                                <Input
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    icon={Calendar}
                                />
                            </div>
                            <div>
                                <Label>Total Members</Label>
                                <Input
                                    type="number"
                                    placeholder="0"
                                    icon={Users}
                                    readOnly
                                    value={members.length}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Part 1: Head of Family */}
                    <Card>
                        <CardHeader
                            title="Head of Family Details"
                            subtitle="Personal information of the household head"
                            icon={User}
                        />
                        <div className="p-6 md:p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label>Full Name</Label>
                                    <Input
                                        name="headName"
                                        value={formData.headName}
                                        onChange={handleInputChange}
                                        placeholder="Enter full name"
                                        icon={User}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>NIC / Passport Number</Label>
                                    <Input
                                        name="nic"
                                        value={formData.nic}
                                        onChange={handleInputChange}
                                        placeholder="Enter Identity Number"
                                        icon={CreditCard}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <Label>Primary Contact</Label>
                                    <Input
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleInputChange}
                                        placeholder="+94 77 123 4567"
                                        icon={Phone}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label>Residential Status</Label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <label className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${formData.residency === 'Own' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                            <input
                                                type="radio"
                                                name="residency"
                                                value="Own"
                                                checked={formData.residency === 'Own'}
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                            <span className={`font-medium ${formData.residency === 'Own' ? 'text-indigo-700' : 'text-slate-600'}`}><T>Own House</T></span>
                                            {formData.residency === 'Own' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-600" />}
                                        </label>
                                        <label className={`relative flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-colors ${formData.residency === 'Rent' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:bg-slate-50'}`}>
                                            <input
                                                type="radio"
                                                name="residency"
                                                value="Rent"
                                                checked={formData.residency === 'Rent'}
                                                onChange={handleInputChange}
                                                className="hidden"
                                            />
                                            <span className={`font-medium ${formData.residency === 'Rent' ? 'text-indigo-700' : 'text-slate-600'}`}><T>Rented</T></span>
                                            {formData.residency === 'Rent' && <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-600" />}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label>Residential Address</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                        <MapPin size={18} />
                                    </div>
                                    <div className='relative'>
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 pl-10 transition-all outline-none placeholder:text-transparent resize-none z-10 relative bg-transparent"
                                        ></textarea>
                                        {/* Hack to show placeholder with translation since textarea doesn't support custom component inside placeholder attribute directly easily without custom wrapper. But actually, we can just use the Input wrapper logic or similar. Let's simplify and use the custom Input wrapper if possible, or just a placeholder span. */}
                                        {!formData.address && (
                                            <div className="absolute left-10 top-3 text-slate-400 text-sm pointer-events-none z-0">
                                                <T>Full residential address...</T>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Part 2: Family Members */}
                    <Card>
                        <CardHeader
                            title="Family Members"
                            subtitle="Add all members living in the same household"
                            icon={Users}
                        />
                        <div className="p-6 md:p-8">
                            <div className="space-y-4">
                                <AnimatePresence initial={false}>
                                    {members.map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="relative grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group hover:border-indigo-200 transition-all"
                                        >
                                            <div className="md:col-span-1 flex items-center justify-center md:justify-start">
                                                <span className="w-8 h-8 flex items-center justify-center bg-indigo-100 text-indigo-700 font-bold rounded-full text-sm">
                                                    {index + 1}
                                                </span>
                                            </div>

                                            <div className="md:col-span-4">
                                                <div className="md:hidden text-xs font-semibold text-slate-500 mb-1"><T>Name</T></div>
                                                <Input
                                                    placeholder="Member Name"
                                                    value={member.name}
                                                    onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                                                />
                                            </div>

                                            <div className="md:col-span-3">
                                                <div className="md:hidden text-xs font-semibold text-slate-500 mb-1"><T>Relationship</T></div>
                                                <Select
                                                    value={member.relation}
                                                    onChange={(e) => handleMemberChange(member.id, 'relation', e.target.value)}
                                                >
                                                    {relationOptions.map(opt => (
                                                        <option key={opt} value={opt}><T>{opt}</T></option>
                                                    ))}
                                                </Select>
                                            </div>

                                            <div className="md:col-span-1">
                                                <div className="md:hidden text-xs font-semibold text-slate-500 mb-1"><T>Age</T></div>
                                                <Input
                                                    placeholder="Age"
                                                    type="number"
                                                    value={member.age}
                                                    onChange={(e) => handleMemberChange(member.id, 'age', e.target.value)}
                                                />
                                            </div>

                                            <div className="md:col-span-3 flex items-center gap-2">
                                                <div className="flex-grow">
                                                    <div className="md:hidden text-xs font-semibold text-slate-500 mb-1"><T>Occupation/Grade</T></div>
                                                    <Input
                                                        placeholder="Job/Grade"
                                                        value={member.job}
                                                        onChange={(e) => handleMemberChange(member.id, 'job', e.target.value)}
                                                    />
                                                </div>
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeMember(member.id)}
                                                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Remove Member"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div className="mt-6 flex justify-center">
                                <Button
                                    type="button"
                                    onClick={addMember}
                                    variant="outline"
                                    className="border-dashed border-2 px-8 py-3 hover:border-indigo-500 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <Plus size={18} />
                                        <span><T>Add Another Member</T></span>
                                    </div>
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Feedback Message */}
                    {message.text && (
                        <div className={`p-4 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <T>{message.text}</T>
                        </div>
                    )}

                    {/* Submit Section */}
                    <div className="flex flex-col items-center gap-4 pt-4 pb-12">
                        <Button
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-12 py-4 text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-2">
                                {isSubmitting ? (
                                    <span><T>Submitting...</T></span>
                                ) : (
                                    <>
                                        <Save size={20} />
                                        <span><T>Submit Registration</T></span>
                                    </>
                                )}
                            </div>
                        </Button>
                        <p className="text-sm text-slate-400">
                            <T>By clicking submit, you certify that the information provided is correct.</T>
                        </p>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default FamilyDetails;
