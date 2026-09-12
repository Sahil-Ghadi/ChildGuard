"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export default function RegisterCase() {
  const [formData, setFormData] = useState({
    child_name: "",
    age: "",
    last_seen_location: "",
    last_seen_timestamp: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ id: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload a photo of the child.");
      return;
    }

    setLoading(true);
    try {
      // 1. Upload photo to Firebase Storage
      const storageRef = ref(storage, `missing-children-photos/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const photo_url = await getDownloadURL(snapshot.ref);

      // 2. Submit data to backend
      const response = await fetch("http://localhost:8000/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          child_name: formData.child_name,
          age: parseInt(formData.age),
          last_seen_location: formData.last_seen_location,
          last_seen_timestamp: formData.last_seen_timestamp,
          description: formData.description,
          photo_url: photo_url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register case on backend");
      }

      const result = await response.json();
      setSuccess({ id: result.caseId });
      setFormData({
        child_name: "",
        age: "",
        last_seen_location: "",
        last_seen_timestamp: "",
        description: "",
      });
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("An error occurred while registering the case.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-[800px] mx-auto mt-space-2xl p-space-xl bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm text-center">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center mx-auto mb-space-md">
          <span className="material-symbols-outlined text-[32px]">check_circle</span>
        </div>
        <h1 className="font-display-sm text-display-sm text-on-surface mb-2 font-bold">Case Registered Successfully</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
          The case has been escalated to the intelligence network. 
        </p>
        <div className="inline-block px-4 py-2 rounded-lg bg-surface-container-low font-headline-sm text-headline-sm font-bold text-on-surface mb-8 border border-outline-variant/30">
          Case ID: {success.id}
        </div>
        <div>
          <button 
            onClick={() => setSuccess(null)}
            className="px-6 py-2.5 rounded-full bg-primary text-on-primary hover:bg-primary-container transition-all font-label-lg text-label-lg"
          >
            Register Another Case
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-margin md:px-margin-tablet lg:px-margin-desktop py-space-xl">
      <div className="max-w-[800px] mx-auto">
        
        <div className="mb-space-lg">
          <h1 className="font-display-sm text-display-sm text-on-surface mb-2 font-bold tracking-tight">Register Missing Child</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Enter the details below to immediately trigger the AI risk assessment and add the case to the national registry.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-space-xl shadow-sm flex flex-col gap-space-lg">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Child's Full Name</label>
              <input 
                required
                type="text" 
                name="child_name"
                value={formData.child_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                placeholder="e.g. Priya Sharma"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Age</label>
              <input 
                required
                type="number" 
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                placeholder="e.g. 7"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Last Seen Location</label>
              <input 
                required
                type="text" 
                name="last_seen_location"
                value={formData.last_seen_location}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
                placeholder="e.g. Delhi Gate Metro Station"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">Date & Time Last Seen</label>
              <input 
                required
                type="datetime-local" 
                name="last_seen_timestamp"
                value={formData.last_seen_timestamp}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Physical Description & Identifiers</label>
            <textarea 
              required
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container transition-all resize-none"
              placeholder="Provide clothing details, height, identifying marks, etc."
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label-md text-label-md text-on-surface font-semibold">Upload Latest Photo</label>
            <div className="w-full border-2 border-dashed border-outline-variant/50 rounded-xl p-space-xl flex flex-col items-center justify-center bg-surface-container-low/50 hover:bg-surface-container-low transition-all cursor-pointer relative overflow-hidden">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <span className="material-symbols-outlined text-[40px] text-primary mb-2">cloud_upload</span>
              <span className="font-label-lg text-label-lg text-on-surface font-bold mb-1">
                {file ? file.name : "Click or drag to upload"}
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant text-center">
                High resolution preferred. Maximum file size 5MB.
              </span>
            </div>
          </div>

          <div className="pt-space-md border-t border-outline-variant/30 flex justify-end">
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-full bg-primary text-on-primary hover:bg-primary-container disabled:opacity-70 disabled:cursor-not-allowed transition-all font-label-lg text-label-lg font-bold flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">how_to_reg</span>
                  Register Case
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
