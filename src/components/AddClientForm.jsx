"use client";

import { useState } from "react";

const AddClientForm = ({ onClientAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Client added successfully!");
        setFormData({ name: "", email: "", phone: "" });
        if (onClientAdded) onClientAdded(); // Refresh client list after adding
      } else {
        throw new Error("Failed to add client");
      }
    } catch (error) {
      console.error(error);
      alert("Error adding client.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Phone</span>
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="input input-bordered"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Add Client
      </button>
    </form>
  );
};

export default AddClientForm;
