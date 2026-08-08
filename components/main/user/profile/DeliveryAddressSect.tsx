"use client";

import React, { useState } from "react";
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
import { Briefcase, Edit2, Home, MapPin, Plus, Trash2 } from "lucide-react";
import HeadingStyle2 from "../../common/HeadingStyle2";

// ঠিকানার টাইপ ডিফাইন করা হলো
type AddressType = "Home" | "Office" | "Other";

interface Address {
  id: string;
  type: AddressType;
  details: string;
  phone: string;
  isDefault: boolean;
}

export function DeliveryAddressesSection() {
  // ১. Initial Dummy Data
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "Home",
      details:
        "House: 45, Road: 12, Sector: 10\nUttara, Dhaka - 1230\nBangladesh",
      phone: "+880 1772 606940",
      isDefault: true,
    },
    {
      id: "2",
      type: "Office",
      details:
        "Suite 5B, Level 5, House 21\nRoad 136, Gulshan-1\nDhaka - 1212, Bangladesh",
      phone: "+880 1772 606940",
      isDefault: false,
    },
  ]);

  // ২. Modal ও Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const defaultFormState: Address = {
    id: "",
    type: "Home",
    details: "",
    phone: "",
    isDefault: false,
  };

  const [formData, setFormData] = useState<Address>(defaultFormState);

  // ৩. Handlers (Add, Edit, Delete)
  const handleAddNew = () => {
    setFormData({ ...defaultFormState, id: Date.now().toString() });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?",
    );
    if (confirmDelete) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.details || !formData.phone) {
      alert("Please fill out the address details and phone number.");
      return;
    }

    let updatedAddresses = [...addresses];

    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map((addr) => ({
        ...addr,
        isDefault: false,
      }));
    }

    if (isEditing) {
      // Edit Existing
      updatedAddresses = updatedAddresses.map((addr) =>
        addr.id === formData.id ? formData : addr,
      );
    } else {
      // Add New
      if (updatedAddresses.length === 0) {
        formData.isDefault = true;
      }
      updatedAddresses.push(formData);
    }

    setAddresses(updatedAddresses);
    setIsModalOpen(false);
  };

  // Icon Helper Function
  const getIcon = (type: AddressType) => {
    switch (type) {
      case "Home":
        return <Home className="w-3.5 h-3.5" />;
      case "Office":
        return <Briefcase className="w-3.5 h-3.5" />;
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  return (
    <section className="mb-8 mt-14">
      <div className="flex justify-between items-center flex-wrap mb-4">
        <HeadingStyle2
          firstTitle="Delivery"
          secondTitle="Addresses"
          isUnderLine={false}
          className="mb-5"
        />
        <Button
          onClick={handleAddNew}
          variant="ghost"
          className="text-primary-dark hover:text-primary hover:bg-green-50 font-semibold md:px-2 px-0"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Address
        </Button>
      </div>

      {/* Address List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((address) => (
          <Card
            key={address.id}
            className="shadow-sm border border-gray-100 rounded-md"
          >
            <CardContent className="px-6 flex flex-col h-full justify-between pt-6">
              <div>
                {/* Badge for Type and Default Status */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    className={`gap-1 rounded border ${
                      address.type === "Home"
                        ? "bg-primary/15 text-primary-dark hover:bg-green-50 border-primary/45"
                        : address.type === "Office"
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-50 border-purple-300"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-50 border-blue-300"
                    }`}
                  >
                    {getIcon(address.type)} {address.type}
                  </Badge>
                  {address.isDefault && (
                    <Badge
                      variant="outline"
                      className="text-xs border-green-500 text-green-600 bg-green-50"
                    >
                      Default
                    </Badge>
                  )}
                </div>

                {/* Details */}
                <p className="text-gray-600 text-sm leading-relaxed mb-1 whitespace-pre-wrap">
                  {address.details}
                </p>
                <p className="text-gray-600 text-sm mt-2 font-medium">
                  Phone: {address.phone}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
                <Button
                  onClick={() => handleEdit(address)}
                  className="text-primary-dark bg-primary/20 text-sm font-semibold flex items-center gap-1 hover:underline h-8 px-3"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </Button>
                <Button
                  onClick={() => handleDelete(address.id)}
                  variant="destructive"
                  className="text-red-500 bg-red-50 text-sm font-semibold flex items-center gap-1 hover:underline h-8 px-3"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {addresses.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500 border border-dashed rounded-md">
            No addresses found. Please add a new delivery address.
          </div>
        )}
      </div>

      {/* =========================================
          Add / Edit Address Modal 
      ========================================== */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>
              <HeadingStyle2
                firstTitle={isEditing ? "Edit" : "Add New"}
                secondTitle="Address"
                size="sm"
                isUnderLine={false}
                className="mb-0"
              />
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Native Select for Address Type */}
            <div className="grid gap-2">
              <Label htmlFor="type">Address Type</Label>
              <select
                id="type"
                value={formData.type ?? "Home"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as AddressType,
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Home">Home</option>
                <option value="Office">Office</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Native Textarea for Full Address Details */}
            <div className="grid gap-2">
              <Label htmlFor="details">Full Address</Label>
              <textarea
                id="details"
                rows={4}
                placeholder="House: 45, Road: 12, Sector: 10&#10;Uttara, Dhaka - 1230"
                value={formData.details ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>

            {/* Phone Number Input */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+880 1xxxxxxxxx"
                value={formData.phone ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            {/* Default Checkbox using Native Input */}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault ?? false}
                onChange={(e) =>
                  setFormData({ ...formData, isDefault: e.target.checked })
                }
                className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"
                disabled={addresses.length === 0}
              />
              <Label
                htmlFor="isDefault"
                className="cursor-pointer text-gray-700"
              >
                Set as Default Address
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary-dark hover:bg-green-800 text-white"
            >
              {isEditing ? "Save Changes" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
