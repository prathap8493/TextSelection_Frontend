import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faPencilAlt, faCompressAlt, faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { Button, Box, Flex, useToast, Text } from '@chakra-ui/react';
import axios from "axios";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Placeholder from '@tiptap/extension-placeholder';

const Home = () => {

  const [rephraseData, setRephraseData] = useState([]);
  const [wordOutputCount, setOutputWordCount] = useState(0);

  
  const toast = useToast();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing here..."
      })
    ],
    content: ''
  });

  useEffect(() => {
    setOutputWordCount(editor?.state.doc.textContent.trim().split(/\s+/).filter(Boolean).length);
  }, [editor?.state.doc.textContent]);

  const handleClick = async (action) => {
    if (!editor) return;

    const { empty, from, to } = editor.state.selection;

    if (empty) {
      toast({
        title: "No text selected",
        description: "Please select some text to apply the transformation.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const text = editor.state.doc.textBetween(from, to, '\n');

    try {
      const response = await fetch('https://textselection-backend-5.onrender.com/PostText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, option: action })
      });

      const data = await response.json();

      if (response.ok) {
        editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, `${data.data}`).run();
      } else {
        toast({
          title: "Error",
          description: data.message || "An error occurred while processing your request.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Network error",
        description: "Could not connect to the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGenerateSampleTexts = async () => {
    try {
      if (editor) {
        const text = editor.state.doc.textContent;
        const data = {
          text: text
        }
        const res = await axios.post('https://textselection-backend-5.onrender.com/rephrase', data);
        if (res?.data?.status == "success") {
          const parsedData = JSON.parse(res.data.data);
          setRephraseData(parsedData);
        }
        console.log(res)
        console.log(text);
      } else {
        console.log("Editor is not initialized.");
      }
    }
    catch (error) {

    }
  }

  const focusEditor = () => {
    if (editor) {
      editor.commands.focus();
    }
  };

  const parseData = (dataString) => {
    return dataString?.replace(/\[\n|\n\]|\n/g, '').split('"\n\n"').map(item => item.trim().replace(/\"/g, ''));
  };

  const handleCopy = () => {
    if (editor.state.doc.textContent) {
        navigator.clipboard.writeText(editor.state.doc.textContent);
        toast({
          title: "Success",
          description: "Text Copied",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
    }
    else {
      toast({
        title: "Error",
        description: "Nothing to copy",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
};

  return (
    <>
      <Box display="flex" flexDirection={["column", "column", "row"]}
        width={["100%", "100%", "85%"]}
        boxShadow="0px 0px 15px rgba(0,0,0,0.1)"
        borderRadius="8px"
        height={["auto", "auto", "calc(100vh - 100px)"]}
        mt={10}
        ml={[0, 0, 20]}
        overflow="hidden"
      >
        <Box width={["100%", "100%", "50%"]} p={5}
          bg="white"
        >
          <Box height="90%" cursor="text" border="1px solid #E2E8F0" onClick={focusEditor} overflow={"auto"}>
            {editor && (
              <BubbleMenu editor={editor} tippyOptions={{ placement: 'top-start' }}>
                <Flex alignItems="center" bg="gray.50" p={2} borderRadius="md"gap={1} boxShadow="inset 0 0 6px rgba(0,0,0,0.1)">
                  <Tippy content="Correct">
                    <Button onClick={() => handleClick('correct')} variant="outline">
                      <FontAwesomeIcon icon={faCheck} />
                    </Button>
                  </Tippy>
                  <Tippy content="Elaborate">
                    <Button onClick={() => handleClick('elaborate')} variant="outline">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </Button>
                  </Tippy>
                  <Tippy content="Shorten">
                    <Button onClick={() => handleClick('shorten')} variant="outline">
                      <FontAwesomeIcon icon={faCompressAlt} />
                    </Button>
                  </Tippy>
                  <Tippy content="Rewrite">
                    <Button onClick={() => handleClick('rewrite')} variant="outline">
                      <FontAwesomeIcon icon={faRedoAlt} />
                    </Button>
                  </Tippy>
                </Flex>
              </BubbleMenu>
            )}
            <EditorContent editor={editor} />
          </Box>
          <Box my={3} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Text>Word Count:{wordOutputCount}</Text>
            <Text display={"flex"} alignItems={"center"} cursor={"pointer"}>
              <Box fontSize={"17px"} mr={"2px"}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="Home_editor_cmd_icon__wMSi_" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2H10c-1.103 0-2 .897-2 2v4H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2v-4h4c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM4 20V10h10l.002 10H4zm16-6h-4v-4c0-1.103-.897-2-2-2h-4V4h10v10z"></path></svg>
              </Box>
              <Text as="span" fontSize={"15px"} onClick={handleCopy}>Copy</Text>
            </Text>
          </Box>
        </Box>
        <Box width={["100%", "100%", "50%"]} p={5} bg="gray.100" overflow={"auto"}>
          <Tabs variant='enclosed' colorScheme='blue'>
            <TabList mb="1em">
              <Tab><Text fontWeight={"semiBold"} fontSize={"18px"}>Version 1</Text></Tab>
              <Tab><Text fontWeight={"semiBold"} fontSize={"18px"}>Version 2</Text></Tab>
              <Tab><Text fontWeight={"semiBold"} fontSize={"18px"}>Version 3</Text></Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Text>{rephraseData[0] || "No data"}</Text>
              </TabPanel>
              <TabPanel>
                <Text>{rephraseData[1] || "No data"}</Text>
              </TabPanel>
              <TabPanel>
                <Text>{rephraseData[2] || "No data"}</Text>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      <Button colorScheme="blue" ml={["5%", "5%", "25%"]} mt={3} onClick={handleGenerateSampleTexts}>Generate</Button>
    </>
  );
};

export default Home;
