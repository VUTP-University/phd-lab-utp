import React from 'react';

export default function Footer() {
    return (
      <footer className="bg-gray-100 py-8">
        <div className="text-center text-gray-600">
          © {new Date().getFullYear()} PHD-Lab. All rights reserved.
        </div>
      </footer>
    );
  }