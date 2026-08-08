"use client";

import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CheckCircle2, Edit2 } from "lucide-react";
import HeadingStyle2 from "../../common/HeadingStyle2"; // আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী পাথ ঠিক করে নিবেন

export default function ProfileInformationSection() {
  // 1. Initial State Setup
  const [profile, setProfile] = useState({
    name: "MD. Taraque Rahman Fahim",
    email: "fahim@example.com",
    phone: "+880 1772 606940",
    dob: "1998-05-12",
    gender: "Male",
    memberSince: "20 Jan 2024",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
  });

  const [formData, setFormData] = useState(profile);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Handle Profile Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev) => ({ ...prev, avatarUrl: imageUrl }));
    }
  };

  // 3. Handle Save Profile Data
  const handleSaveProfile = () => {
    setProfile(formData);
    setIsModalOpen(false); // Close Modal
  };

  // 4. Format Date for Display
  const formatDateForDisplay = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mb-8">
      <div className="mb-4">
        <HeadingStyle2
          firstTitle="Profile"
          secondTitle="Information"
          isUnderLine={false}
          position={4}
          className="mb-5"
        />
        <p className="text-sm text-gray-500">
          Manage your personal details and account information.
        </p>
      </div>

      <Card className="shadow-sm border-gray-100 rounded-md">
        <CardContent className="px-6 flex gap-14 items-start flex-col md:flex-row pt-6">
          {/* Avatar with Camera Icon */}
          <div className="relative my-auto flex-[0.1] w-full flex justify-center md:justify-start">
            <Avatar className="w-34 h-34 border border-gray-200 relative overflow-visible">
              <AvatarImage
                src={profile.avatarUrl ?? ""}
                alt="Profile"
                className="rounded-full object-cover w-full h-full"
              />
              <AvatarFallback>TF</AvatarFallback>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 z-10 transition-colors"
                title="Change Profile Picture"
              >
                <Camera className="w-4 h-4 text-gray-600" />
              </button>
            </Avatar>
          </div>

          <div className="flex-[0.9] w-full">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex items-center gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {profile.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 gap-1 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4 bg-primary-dark rounded-full text-white" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{profile.email}</p>
                  <p className="text-gray-600 text-sm">{profile.phone}</p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setFormData(profile);
                  setIsModalOpen(true);
                }}
                className="text-green-700 border-green-700 hover:bg-green-50 font-semibold rounded-sm"
              >
                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
              </Button>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Date of Birth</p>
                <p className="font-semibold text-gray-900">
                  {formatDateForDisplay(profile.dob)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Gender</p>
                <p className="font-semibold text-gray-900">{profile.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Member Since</p>
                <p className="font-semibold text-gray-900">
                  {profile.memberSince}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =========================================
          Edit Profile Modal 
      ========================================== */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              <HeadingStyle2
                firstTitle="Edit Profile "
                secondTitle="Information"
                size="sm"
                isUnderLine={false}
                className="mb-0"
              />
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>

              {/* Native Select with Shadcn Styling */}
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  value={formData.gender ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveProfile}
              className="bg-green-700 hover:bg-green-800 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
