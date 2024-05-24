import React from 'react';
import { useEditor, EditorContent, StarterKit } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';

const Editor = ({ content, errors }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Placeholder.configure({
        placeholder: 'Start typing here...'
      })
    ],
    content: content,
  });

  React.useEffect(() => {
    if (editor && errors.length > 0) {
      errors.forEach((error) => {
        editor.chain().focus()
          .setTextStyle({
            class: 'error',
            title: error.message
          }, {
            from: error.offset,
            to: error.offset + error.length
          })
          .run();
      });
    }
  }, [editor, errors]);

  return <EditorContent editor={editor} />;
};

export default Editor;
