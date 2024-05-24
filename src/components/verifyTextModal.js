import React from 'react';
import { Box, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { Editor, EditorState, Modifier, CompositeDecorator, ContentState, SelectionState } from 'draft-js';
import 'draft-js/dist/Draft.css';

function VerifyTextModal({ data, content, setContent }) {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  const handleReplaceText = (offset, length, correctedText) => {
    const currentContent = content.getCurrentContent();
    const selectionState = SelectionState.createEmpty(currentContent.getFirstBlock().getKey())
      .merge({
        anchorOffset: offset,
        focusOffset: offset + length,
      });

    const newContent = Modifier.replaceText(currentContent, selectionState, correctedText);
    const newEditorState = EditorState.push(content, newContent, 'insert-characters');
    setContent(newEditorState);
  };

  return (
    <Box width="100%" padding="4" h="70vh" display={"flex"}>
        <Box width={"60%"} m="2" boxShadow="md" borderRadius="lg" color={"black"}>
          <Editor
              editorState={content}
              readOnly
              placeholder="Your text with errors will display here"
              style={{
                flex: 1,
                borderRadius: '0 8px 8px 0',
                color: "black",
                boxShadow: 'none',
                fontSize: "16px",
                backgroundColor: "white",
                height: "65vh"
              }}
            />
        </Box>
        <Box width={"40%"} h={"100%"} overflowY={"scroll"} p="2">
            {data?.map((item, index) => (
            <Box key={index} bg="gray.100" p="4" borderRadius="md" mb="4" color={"black"}>
              <Text fontSize="lg" fontWeight="bold">Corrected Text:</Text>
              <Text mb="2">{item.Corrected}</Text>
              <Button colorScheme="blue" size="sm" onClick={() => handleReplaceText(item.Offset, item.Length, item.Corrected)}>
                Replace
              </Button>
              <Text fontSize="sm" fontStyle="italic" mt={2}>Original:</Text>
              <Text mb="2">{item.Original}</Text>
              <Text fontSize="sm" fontStyle="italic">Rule:</Text>
              <Text mb="2">{item.Rule}</Text>
              <Text fontSize="sm" fontStyle="italic">Example Incorrect:</Text>
              <Text mb="1">{item.example_incorrect}</Text>
              <Text fontSize="sm" fontStyle="italic">Example Correct:</Text>
              <Text>{item.example_correct}</Text>
            </Box>
            ))}
        </Box>
    </Box>
  );
}

export default VerifyTextModal;
