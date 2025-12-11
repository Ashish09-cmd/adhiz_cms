'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamic import to prevent SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div>
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange} 
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }}
      />
    </div>
  );
};

export default RichTextEditor;
