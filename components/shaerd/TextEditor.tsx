"use client";

import React, { useRef, useState, useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import FontFamily from "@tiptap/extension-font-family";
import FontSize from "tiptap-extension-font-size";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  name: string;
  label?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  control?: any;
}

// Predefined color palette
const colorPalette = [
  "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", 
  "#FFA500", "#800080", "#008000", "#A52A2A", "#808080", "#d40078", "#1E90FF", 
  "#32CD32", "#FF4500", "#4B0082", "#8B4513", "#2E8B57", "#D2691E",
];

// Editor component that safely uses hooks at the top level
const EditorComponent: React.FC<{
  field: any;
  error?: any;
  name: string;
  label?: string;
  className?: string;
}> = ({ field, error, name, label, className }) => {
  // All hooks at the top level of the component
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState("12px");
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#000000");

  // Create a Tiptap editor instance
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "tiptap-bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "tiptap-ordered-list",
        },
      }),
      ListItem,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      Superscript,
      Subscript,
      FontFamily.configure({
        types: ["textStyle"],
      }),
      FontSize.configure({
        types: ["textStyle"],
      }),
    ],
    content: field.value || "<p></p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      field.onChange(html);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none w-full",
      },
    },
  });

  // Handle clicking outside of color picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync editor content with field value
  useEffect(() => {
    if (editor && field.value && editor.getHTML() !== field.value) {
      editor.commands.setContent(field.value);
    }
  }, [editor, field.value]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const applyFontSize = (size: string) => {
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  const applyFontFamily = (family: string) => {
    setFontFamily(family);
    editor.chain().focus().setFontFamily(family).run();
  };

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
    setColor(color);
  };

  const addImageUrl = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleLink = () => {
    const currentUrl = editor.isActive("link") ? editor.getAttributes("link").href : "";
    const url = window.prompt("Enter URL", currentUrl);

    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else if (url === "") {
      editor.chain().focus().unsetLink().run();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size too large. Please select an image smaller than 10MB.");
      return;
    }

    try {
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const result = e.target?.result;
          if (typeof result === "string") {
            editor.chain().focus().setImage({ src: result }).run();
            console.log("Image uploaded successfully");
          } else {
            console.error("FileReader result is not a string:", typeof result);
            alert("Error processing image. Please try again.");
          }
        } catch (err) {
          console.error("Error in onload handler:", err);
          alert("Error processing image. Please try again.");
        }
      };

      reader.onerror = (e) => {
        console.error("FileReader error:", e);
        alert("Error reading file. Please try again.");
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Error in handleFileChange:", err);
      alert("Error processing file. Please try again.");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const addLocalImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleBulletList = () => {
    editor.commands.focus();
    editor.commands.toggleBulletList();
  };

  const toggleOrderedList = () => {
    editor.commands.focus();
    editor.commands.toggleOrderedList();
  };

  const isActive = (type: string, options = {}) => {
    return editor.isActive(type, options);
  };

  const getButtonClass = (type: string, options = {}) => {
    return `px-2 py-1 border-none rounded ${
      isActive(type, options) ? "bg-[#C1EBE7]" : "bg-transparent"
    }`;
  };

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label htmlFor={name} className="text-black text-base font-medium">
          {label}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      <div className="flex flex-wrap items-center gap-2 bg-green-lighter p-2 rounded-md">
        <select
          value={fontFamily}
          onChange={(e) => applyFontFamily(e.target.value)}
          className="border rounded px-2 py-1 bg-transparent"
        >
          <option value="Roboto">Roboto</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
        </select>

        <select
          value={fontSize}
          onChange={(e) => applyFontSize(e.target.value)}
          className="border rounded px-2 py-1 bg-transparent"
        >
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
        </select>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={getButtonClass("bold")}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={getButtonClass("italic")}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={getButtonClass("underline")}
          title="Underline"
        >
          U
        </button>

        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-2 py-1 rounded bg-transparent hover:bg-pink-50 flex items-center"
            title="Text color"
          >
            <div className="w-5 h-5 rounded-sm" style={{ background: color }} />
          </button>

          {showColorPicker && (
            <div className="absolute left-0 mt-1 p-2 bg-white shadow-lg rounded-md z-20 border w-40">
              <div className="grid grid-cols-5 gap-2">
                {colorPalette.map((color) => (
                  <div
                    key={color}
                    onClick={() => applyColor(color)}
                    className="w-6 h-6 rounded cursor-pointer border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggleBulletList}
          className={getButtonClass("bulletList")}
          title="Bullet list"
        >
          • List
        </button>
        <button
          type="button"
          onClick={toggleOrderedList}
          className={getButtonClass("orderedList")}
          title="Numbered list"
        >
          1. List
        </button>

        <button
          type="button"
          onClick={addLocalImage}
          className="px-2 py-1 rounded"
          title="Upload image from device"
        >
          🖼️ Upload
        </button>
        <button
          type="button"
          onClick={addImageUrl}
          className="px-2 py-1 rounded"
          title="Add image from URL"
        >
          🔗 Image URL
        </button>

        <button
          type="button"
          onClick={handleLink}
          className={getButtonClass("link")}
          title={
            editor.isActive("link")
              ? `Edit link: ${editor.getAttributes("link").href}`
              : "Insert link"
          }
        >
          🔗 {editor.isActive("link") ? "Edit Link" : "Link"}
        </button>
      </div>

      <div
        className={cn(
          "rounded-md p-2 min-h-[150px]",
          error && "border-red-700",
          className,
          "border-[1.5px] border-[#BABFC4]"
        )}
      >
        <EditorContent editor={editor} className="custom-editor-content" />
      </div>

      {error && <p className="text-red-700 text-sm mt-1">{error.message}</p>}

      <style jsx global>{`
        .ProseMirror {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
          height: 100%;
          min-height: 150px;
        }

        .ProseMirror:focus {
          outline: none !important;
          border: none !important;
          box-shadow: none !important;
        }

        .custom-editor-content {
          height: 100%;
        }

        .custom-editor-content .ProseMirror {
          padding: 8px;
        }

        .tiptap-bullet-list,
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
        }

        .tiptap-ordered-list,
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
        }

        .ProseMirror img,
        .tiptap-image {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          display: block;
        }
      `}</style>
    </div>
  );
};

// UncontrolledEditor component for direct value/onChange usage
const UncontrolledEditor: React.FC<{
  name: string;
  label?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ name, label, className, value, onChange }) => {
  // Hooks at top level
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fontSize, setFontSize] = useState("12px");
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [color, setColor] = useState("#000000");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: { class: "tiptap-bullet-list" },
      }),
      OrderedList.configure({
        HTMLAttributes: { class: "tiptap-ordered-list" },
      }),
      ListItem,
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: { class: "tiptap-image" },
      }),
      Superscript,
      Subscript,
      FontFamily.configure({ types: ["textStyle"] }),
      FontSize.configure({ types: ["textStyle"] }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: { class: "focus:outline-none w-full" },
    },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  // Same methods as EditorComponent but simplified for space
  const applyFontSize = (size: string) => {
    setFontSize(size);
    editor.chain().focus().setFontSize(size).run();
  };

  const applyFontFamily = (family: string) => {
    setFontFamily(family);
    editor.chain().focus().setFontFamily(family).run();
  };

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
    setColor(color);
  };

  const addImageUrl = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleLink = () => {
    const currentUrl = editor.isActive("link") ? editor.getAttributes("link").href : "";
    const url = window.prompt("Enter URL", currentUrl);
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    } else if (url === "") {
      editor.chain().focus().unsetLink().run();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        editor.chain().focus().setImage({ src: result }).run();
      }
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addLocalImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const isActive = (type: string, options = {}) => editor.isActive(type, options);
  const getButtonClass = (type: string, options = {}) => 
    `px-2 py-1 border-none rounded ${isActive(type, options) ? "bg-[#C1EBE7]" : "bg-transparent"}`;

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label htmlFor={name} className="text-black text-base font-medium">
          {label}
        </label>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      <div className="flex flex-wrap items-center gap-2 bg-green-lighter p-2 rounded-md">
        <select value={fontFamily} onChange={(e) => applyFontFamily(e.target.value)} className="border rounded px-2 py-1 bg-transparent">
          <option value="Roboto">Roboto</option>
          <option value="Georgia">Georgia</option>
          <option value="Arial">Arial</option>
          <option value="Courier New">Courier New</option>
        </select>

        <select value={fontSize} onChange={(e) => applyFontSize(e.target.value)} className="border rounded px-2 py-1 bg-transparent">
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
        </select>

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonClass("bold")} title="Bold">B</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonClass("italic")} title="Italic">I</button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={getButtonClass("underline")} title="Underline">U</button>

        <div className="relative" ref={colorPickerRef}>
          <button type="button" onClick={() => setShowColorPicker(!showColorPicker)} className="px-2 py-1 rounded bg-transparent hover:bg-pink-50 flex items-center" title="Text color">
            <div className="w-5 h-5 rounded-sm" style={{ background: color }} />
          </button>

          {showColorPicker && (
            <div className="absolute left-0 mt-1 p-2 bg-white shadow-lg rounded-md z-20 border w-40">
              <div className="grid grid-cols-5 gap-2">
                {colorPalette.map((color) => (
                  <div key={color} onClick={() => applyColor(color)} className="w-6 h-6 rounded cursor-pointer border hover:scale-110 transition-transform" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </div>
          )}
        </div>

        <button type="button" onClick={() => editor.commands.toggleBulletList()} className={getButtonClass("bulletList")} title="Bullet list">• List</button>
        <button type="button" onClick={() => editor.commands.toggleOrderedList()} className={getButtonClass("orderedList")} title="Numbered list">1. List</button>
        <button type="button" onClick={addLocalImage} className="px-2 py-1 rounded" title="Upload image from device">🖼️ Upload</button>
        <button type="button" onClick={addImageUrl} className="px-2 py-1 rounded" title="Add image from URL">🔗 Image URL</button>
        <button type="button" onClick={handleLink} className={getButtonClass("link")} title={editor.isActive("link") ? `Edit link: ${editor.getAttributes("link").href}` : "Insert link"}>🔗 {editor.isActive("link") ? "Edit Link" : "Link"}</button>
      </div>

      <div className={cn("rounded-md p-2 min-h-[150px]", className, "border-[1.5px] border-[#BABFC4]")}>
        <EditorContent editor={editor} className="custom-editor-content" />
      </div>

      <style jsx global>{`
        .ProseMirror { outline: none !important; border: none !important; box-shadow: none !important; height: 100%; min-height: 150px; }
        .ProseMirror:focus { outline: none !important; border: none !important; box-shadow: none !important; }
        .custom-editor-content { height: 100%; }
        .custom-editor-content .ProseMirror { padding: 8px; }
        .tiptap-bullet-list, .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
        .tiptap-ordered-list, .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; }
        .ProseMirror img, .tiptap-image { max-width: 100%; height: auto; margin: 1em 0; display: block; }
      `}</style>
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  name,
  label,
  className,
  value,
  onChange,
  control: externalControl,
}) => {
  // Hook at top level - safe now
  let formContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    formContext = useFormContext();
  } catch (error) {
    formContext = null;
  }

  const control = externalControl || formContext?.control;

  // If no control but we have value/onChange, use uncontrolled editor
  if (!control && value !== undefined && onChange) {
    return (
      <UncontrolledEditor
        name={name}
        label={label}
        className={className}
        value={value}
        onChange={onChange}
      />
    );
  }

  // If no control available, render fallback
  if (!control) {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label htmlFor={name} className="text-black text-base font-medium">
            {label}
          </label>
        )}
        <div className={cn("rounded-md p-2 min-h-[150px]", className, "border-[1.5px] border-[#BABFC4]")}>
          <p className="text-gray-500">Rich text editor requires form context or value/onChange props</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <EditorComponent
            field={field}
            error={error}
            name={name}
            label={label}
            className={className}
          />
        )}
      />
    </div>
  );
};

export default RichTextEditor;
