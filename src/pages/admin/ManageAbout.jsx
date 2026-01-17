import { useState, useEffect } from 'react';
import { Save, Info, Upload } from 'lucide-react';
import Button from '../../components/ui/Button';

const ManageAbout = () => {
    const [aboutData, setAboutData] = useState(() => {
        const saved = localStorage.getItem('homeAbout');
        return saved ? JSON.parse(saved) : {
            title: 'About Our Community',
            description1: 'Al-Noor Masjid has been the heart of the local Muslim community since 1995. We are dedicated to preserving an Islamic identity, building and supporting a viable Muslim community, and promoting a comprehensive Islamic way of life based on the Holy Quran and the Sunnah of Prophet Muhammad (PBUH).',
            description2: 'We offer daily prayers, educational programs, social services, and community events for men, women, and children of all backgrounds.',
            imageUrl: 'https://images.unsplash.com/photo-1542043681-325d799be53c?auto=format&fit=crop&q=80&w=800'
        };
    });

    useEffect(() => {
        localStorage.setItem('homeAbout', JSON.stringify(aboutData));
    }, [aboutData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAboutData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 500000) { // 500KB limit
                alert("File is too large. Please upload an image smaller than 500KB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setAboutData(prev => ({ ...prev, imageUrl: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert('About section updated successfully!');
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Manage About Section</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                        <input
                            type="text"
                            name="title"
                            value={aboutData.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                            placeholder="e.g. About Our Community"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description Paragraph 1
                        </label>
                        <textarea
                            name="description1"
                            value={aboutData.description1}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                            placeholder="First paragraph of the about section..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description Paragraph 2
                        </label>
                        <textarea
                            name="description2"
                            value={aboutData.description2}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none"
                            placeholder="Second paragraph..."
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">About Image</label>

                        <div className="space-y-3">
                            {/* Local Upload */}
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <Upload className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                                <span className="text-xs text-gray-500">Max size: 500KB</span>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">Or use URL</span>
                                </div>
                            </div>

                            {/* URL Input */}
                            <input
                                type="text"
                                name="imageUrl"
                                value={aboutData.imageUrl}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green/20 focus:border-islamic-green outline-none text-sm"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Image Preview */}
                    {aboutData.imageUrl && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                            <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                <img
                                    src={aboutData.imageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/800x450?text=Invalid+Image+URL'}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex pt-4">
                        <Button type="submit" className="gap-2">
                            <Save className="w-4 h-4" /> Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManageAbout;
