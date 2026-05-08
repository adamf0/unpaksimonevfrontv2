"use client";

import DOMPurify from "dompurify";
import Label from "../Atoms/Label";

import { CKEditor } from "@ckeditor/ckeditor5-react";
// @ts-ignore
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface CKEditorFieldProps {
  label: string;
  id: string;
  value?: string;
  placeholder?: string;
  error?: string;
  onChange?: (value: string) => void;
}

export function CKEditorField({
  label,
  id,
  value = "",
  placeholder,
  error,
  onChange,
}: CKEditorFieldProps) {
  const sanitizeStrict = (dirty: string) => {
    /**
     * RESET HOOK
     */
    DOMPurify.removeAllHooks();

    /**
     * FORCE REMOVE ALL ATTRIBUTES
     */
    DOMPurify.addHook("uponSanitizeAttribute", (_, data) => {
      /**
       * REMOVE ALL ATTRIBUTES
       */
      data.keepAttr = false;

      /**
       * BLOCK javascript:
       */
      if (
        typeof data.attrValue === "string" &&
        data.attrValue
          .toLowerCase()
          .replace(/\s/g, "")
          .startsWith("javascript:")
      ) {
        data.keepAttr = false;
      }
    });

    return DOMPurify.sanitize(dirty, {
      /**
       * ONLY THESE TAGS
       */
      ALLOWED_TAGS: [
        "p",
        "br",

        "strong",
        "b",

        "em",
        "i",

        "u",

        "ul",
        "ol",
        "li",

        "blockquote",
      ],

      /**
       * NO ATTRIBUTE ALLOWED
       */
      ALLOWED_ATTR: [],

      /**
       * BLOCK URI TOTAL
       */
      ALLOWED_URI_REGEXP: /^$/,

      /**
       * FORBIDDEN TAGS
       */
      FORBID_TAGS: [
        "script",
        "style",
        "iframe",
        "object",
        "embed",

        "svg",
        "math",
        "canvas",

        "img",
        "picture",

        "video",
        "audio",
        "source",

        "table",
        "thead",
        "tbody",
        "tfoot",
        "tr",
        "td",
        "th",

        "a",

        "form",
        "input",
        "button",
        "textarea",
        "select",
        "option",

        "meta",
        "link",
        "base",

        "frame",
        "frameset",

        "portal",

        "template",

        "slot",

        "applet",

        "noscript",
      ],

      /**
       * BLOCK ALL ATTRIBUTES
       */
      FORBID_ATTR: ["*"],

      /**
       * SECURITY HARDENING
       */
      KEEP_CONTENT: true,
      SAFE_FOR_TEMPLATES: true,
      WHOLE_DOCUMENT: false,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false,
    });
  };

  /**
   * DECODE HTML ENTITY
   */
  const decodeHtml = (html: string) => {
    if (typeof window === "undefined") return html;

    const txt = document.createElement("textarea");
    txt.innerHTML = html;

    return txt.value;
  };

  /**
   * SAFE VALUE
   */
  const safeValue = sanitizeStrict(decodeHtml(value || ""));

  return (
    <div className="space-y-2">
      <Label
        className="text-sm font-bold text-on-surface-variant ml-1"
        htmlFor={id}
      >
        {label}
      </Label>

      <div className="rounded-xl overflow-hidden border border-outline-variant bg-surface-container-low">
        <CKEditor
          editor={ClassicEditor}
          data={safeValue}
          config={{
            placeholder,

            /**
             * TOOLBAR SUPER STRICT
             */
            toolbar: [
              "bold",
              "italic",
              "underline",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "blockQuote",
              "|",
              "undo",
              "redo",
            ],

            /**
             * MATIKAN SEMUA FITUR BERBAHAYA
             */
            removePlugins: [
              "Image",
              "ImageToolbar",
              "ImageCaption",
              "ImageStyle",
              "ImageResize",
              "ImageUpload",
              "EasyImage",

              "MediaEmbed",

              "Table",
              "TableToolbar",
              "TableProperties",
              "TableCellProperties",

              "Link",

              "HtmlEmbed",
              "HtmlComment",

              "CKFinder",
              "CKBox",

              "Markdown",

              "CodeBlock",

              "SourceEditing",

              "SpecialCharacters",

              "HorizontalLine",

              "PageBreak",

              "PasteFromOffice",

              "CKFinderUploadAdapter",
            ],
          }}
          onChange={(_, editor) => {
            const raw = editor.getData();

            const clean = sanitizeStrict(raw);

            onChange?.(clean);
          }}
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
