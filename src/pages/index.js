import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Tooltip as ChakraTooltip,
  useToast,
  Button,
  Stack,
  Heading,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import { BiBookmark, BiCopy } from "react-icons/bi";
import { MdBookmarkAdded, MdDelete, MdDeleteOutline } from "react-icons/md";
import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import {
  Editor,
  EditorState,
  CompositeDecorator,
  convertToRaw,
  ContentState,
  RichUtils,
  Modifier, 
  SelectionState, 
} from "draft-js";
import Tippy from "@tippyjs/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faPencilAlt,
  faCompressAlt,
  faRedoAlt,
} from "@fortawesome/free-solid-svg-icons";
import "draft-js/dist/Draft.css";
import { SaveUserTextService, verifyTextService } from "@/services/api";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Header from "@/components/Header";
import logo from "@/assets/new_logo.png"
import { api_url, website_url } from "@/config/config";

const Decorated = ({ children, rule }) => {
  return (
    <ChakraTooltip label={rule} placement="top" hasArrow>
      <span
        style={{
          backgroundColor: "rgba(208, 75, 69, 0.3)",
          cursor: "pointer",
        }}
      >
        {children}
      </span>
    </ChakraTooltip>
  );
};

if (!RegExp.escape) {
  RegExp.escape = function (s) {
    return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  };
}

function findWithRegex(words, contentBlock, callback) {
  const text = contentBlock?.getText();
  if (!text) {
    return;
  }
  words.forEach((word) => {
    const escapedWord = RegExp.escape(word);
    const pattern = new RegExp(escapedWord, "g");

    let match;
    while ((match = pattern.exec(text)) !== null) {
      callback(match.index, match.index + match[0].length);
    }
  });
}

function handleStrategy(words, contentBlock, callback) {
  const text = contentBlock.getText();
  words.forEach(({ original }) => {
    const start = text.indexOf(original);
    if (start !== -1) {
      callback(start, start + original.length);
    }
  });
}

const createDecorator = (words) =>
  new CompositeDecorator([
    {
      strategy: (contentBlock, callback) =>
        handleStrategy(words, contentBlock, callback),
      component: ({ children }) => {
        const rule = words.find((word) =>
          word.corrected.includes(children[0].props.text)
        );
        return <Decorated rule={rule?.rule}>{children}</Decorated>;
      },
    },
  ]);

function Playground() {
  const editor = useRef(null);

  const toast = useToast();
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(createDecorator([]))
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [content, setContent] = useState("");
  const [sentences, setSentences] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [aiResult, setAiResult] = useState(null);
  const [characterLength, setCharacterLength] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [updatedContent, setUpdatedContent] = useState({});
  const [rephraseData, setRephraseData] = useState([]);
  const divRef = useRef(null);
  const editorRef = useRef(null);
  const ranEffect = useRef(false);

  const [verifyButtonLoading,setVerifyButtonLoading] = useState(false)
  const [debugButtonLoading,setDebugButtonLoading] = useState(false)
  const [showBookMark,setShowBookMark] = useState(null)

  const [buttonPosition, setButtonPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  const getWordCount = (content) => {
    const words = content?.match(/\b[-?(\w+)?]+\b/gi);
    if (words) return words.length;
    return 0;
  };

  useEffect(() => {
    if (sentences.length > 0) {
      const contentState = editorState.getCurrentContent();
      const newEditorState = EditorState.createWithContent(
        contentState,
        createDecorator(sentences)
      );
      setEditorState(EditorState.moveFocusToEnd(newEditorState));
    }
  }, [sentences]);

  const [isEditorLoaded,setIsEditorLoaded] = useState(false)
  useEffect(() => {
    focusEditor();
  }, []);

  function focusEditor() {
    editor?.current?.focus();
    setIsEditorLoaded(true)
  }

  useEffect(()=>{
    if(isEditorLoaded){
      handleClear();
      setIsEditorLoaded(false)
    }
  })
  const onEditorTextChange = async (e) => {
    const blocks = convertToRaw(e.getCurrentContent()).blocks;
    const value = blocks
      .map((block) => (!block.text.trim() && "\n") || block.text)
      .join("\n");
    const contentLength = e.getCurrentContent().getPlainText("").length;
    setCharacterLength(contentLength);
    getContent(value);
    setEditorState(e);

    if (contentLength === 0) {
      setEditorState((editorState) =>
        RichUtils.toggleBlockType(editorState, "paragraph")
      );
    }
    const selection = e.getSelection();
    console.log(selection);
    if (!selection.isCollapsed()) {
      updateButtonPosition();
    } else {
      console.log("hi");
      setButtonPosition((prev) => ({ ...prev, visible: false }));
    }
  };

  const getContent = (e) => {
    setContent(e);
    const wordCount = getWordCount(e);

    const charCount = e.length;
    if (charCount > 2500) {
      console.log("trigger");
      if (localStorage.getItem("overage_popup") !== null) {
        console.log("alreadyExist");
      } else {
        document.getElementById("characterLimitPopup").click();
        console.log("triggered");
        localStorage.setItem("overage_popup", 1);
      }
    }

    setWordCount(wordCount);
  };

  const verifyText = async () => {
    setDebugButtonLoading(true)
    try {
      const res = await verifyTextService(content);

      if (res.status === "success" && res.data.analysis.length > 0) {
        setShowBookMark(true)
        setAiResult(res.data.analysis);
        const wordsToHighlight = res.data.analysis.map((item) => ({
          original: item.original,
          corrected: item.corrected,
          rule: item.rule,
        }));
        setSentences(wordsToHighlight);
        setDebugButtonLoading(false)
      } else {
        toast({
          title: "Error",
          description: "Something went wrong!",
          status: "warning",
          duration: 1000,
          isClosable: true,
        });
        console.log("No corrections needed or error in fetching data.");
        setDebugButtonLoading(false)
      }
    } catch (error) {
      console.log(error);
      setDebugButtonLoading(false)
    }
  };

  const handlePastedText = (text, html, editorState) => {
    const contentState = ContentState.createFromText(text);
    const newEditorState = EditorState.push(editorState, contentState);
    setEditorState(newEditorState);
    return EditorState.forceSelection(
      newEditorState,
      newEditorState.getSelection()
    );
  };

  const handleReplace = (original, corrected) => {
    const currentContent = editorState.getCurrentContent();
    const blockMap = currentContent.getBlockMap();

    let newContentState = currentContent;

    // Iterate over all blocks
    blockMap.forEach((block) => {
      const key = block.getKey();
      const text = block.getText();
      const startIndex = text.indexOf(original);

      if (startIndex !== -1) {
        const selectionState = SelectionState.createEmpty(key).merge({
          anchorOffset: startIndex,
          focusOffset: startIndex + original.length,
        });

        newContentState = Modifier.replaceText(
          newContentState,
          selectionState,
          corrected
        );
      }
    });

    if (newContentState !== currentContent) {
      const newEditorState = EditorState.push(
        editorState,
        newContentState,
        "insert-characters"
      );
      setEditorState(
        EditorState.forceSelection(
          newEditorState,
          newContentState.getSelectionAfter()
        )
      );

      // Update the highlights to reflect changes
      setUpdatedContent((prev) => ({ ...prev, [original]: true }));
    }
  };

  const updateButtonPosition = () => {
    console.log("enter");
    const selection = window.getSelection();
    if (!selection.rangeCount) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setButtonPosition({
      x: rect.left + window.scrollX + rect.width / 2,
      y: rect.top + window.scrollY - 40,
      visible: true,
    });
  };

  const handleClick = async (action) => {
    console.log("Action triggered:", action);
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      toast({
        title: "No text selected",
        description: "Please select some text to apply the transformation.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const contentState = editorState.getCurrentContent();
    const selectedText = contentState
      .getBlockForKey(selection.getStartKey())
      .getText()
      .slice(selection.getStartOffset(), selection.getEndOffset());

    try {
      const response = await fetch(
        `${api_url}/PostText`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: selectedText, option: action }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const newContentState = Modifier.replaceText(
          contentState,
          selection,
          data.data
        );
        setEditorState((prevState) =>
          EditorState.push(prevState, newContentState, "insert-characters")
        );
      } else {
        toast({
          title: "Error",
          description:
            data.message || "An error occurred while processing your request.",
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
    console.log("Hello");
    setVerifyButtonLoading(true)
    try {
      const contentState = editorState.getCurrentContent();
      const text = contentState.getPlainText();

      const data = { text: text };
      const res = await axios.post(
        `${api_url}/rephrase`,
        data
      );

      if (res?.data?.status === "success") {
        const parsedData = JSON.parse(res.data.data);
        setRephraseData(parsedData);
        setVerifyButtonLoading(false)
        onOpen();
        toast({
          title: "Success",
          description: "We have generated different versions for you!",
          status: "success",
          duration: 1000,
          isClosable: true,
        });
      }
      else{
        toast({
          title: "Warning",
          description: res?.data?.message || "Something went wrong",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
        setVerifyButtonLoading(false)
      }
      console.log(res);
      console.log(text);
    } catch (error) {
      toast({
        title: "Warning",
        description:"Something went wrong",
        status: "error",
        duration: 1000,
        isClosable: true,
      });
      setVerifyButtonLoading(false)
    }
  };

  const handleClear = async () => {
    const editorstate = EditorState.push(
      editorState,
      ContentState.createFromText(""),
      "remove-range"
    );
    editor?.current?.focus();
    setContent("");
    getContent("");
    setCharacterLength(0);
    setEditorState(editorstate);
    setSentences([]);
  };

  const handleCopy = () => {
    if (content.length > 1) {
      navigator.clipboard.writeText(content);
    } else {
    }
  };

  const [tabIndex,setTabIndex] = useState(0)
  const handleTabChange = (index) => {
    setTabIndex(index);
  };
  
  const handleVersionData = () => {
    const text = rephraseData[tabIndex]; 
    if (text) {
      navigator.clipboard.writeText(text);
      toast({
        title: "Success",
        description: `Version ${tabIndex + 1} text Copied`,
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    }
  };
  
  const handleSaveData = async() =>{
    try{
      const res = await SaveUserTextService(content);
      if(res?.status){
        console.log("helo")
        setShowBookMark(false)
      }
    }
    catch(err){

    }
  }

  console.log(buttonPosition, "sdkajsd");
  return (
    <>
      <Modal
        closeOnOverlayClick={false}
        isOpen={isOpen}
        size="7xl"
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent borderRadius="lg" mx={"35"} bg="white">
          <ModalCloseButton color={"black"} />
          <ModalBody pb={6}>
            <Box display="flex" pt="2" h="80vh" mr={5}>
              <Box flex="4">
                <Tabs variant="enclosed" colorScheme="blue" index={tabIndex} onChange={(index) => handleTabChange(index)}>
                <TabList>
                  <Tab>
                    <Text fontWeight={"semiBold"} fontSize={"18px"}>
                      Version 1
                    </Text>
                  </Tab>
                  <Tab>
                    <Text fontWeight={"semiBold"} fontSize={"18px"}>
                      Version 2
                    </Text>
                  </Tab>
                  <Tab>
                    <Text fontWeight={"semiBold"} fontSize={"18px"}>
                      Version 3
                    </Text>
                  </Tab>
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
          </ModalBody>
        </ModalContent>
      </Modal>
      <Box mt="20px" width={"100%"} >
        <Header/>
        <Box borderRight={"2px solid gray"} mt="12px">
          <Heading as={"h1"} fontSize={"32px"} textAlign={"center"} color={"#1A1A1A"}>Perfect Your Prose: Advanced Grammar Correction Technology</Heading>
          <Text fontSize={"16px"} fontWeight={400} textAlign={"center"} w={"80%"} mx={"auto"} mt="2" color={"#475467"}>Unleash the power of cutting-edge technology to refine your writing. Our advanced grammar correction tool scans your text with precision, ensuring every sentence is polished to perfection. Whether you're drafting an email, essay, or report, rely on our solution to deliver clear, error-free communication.</Text>
        </Box>
        <Box display={"flex"} mt="4">
        <Box
          width={"60%"}
          display={"flex"}
          flexDir="column"
          alignItems={"flex-end"}
        >

          <Box
            w="90%"
            bg="white"
            color={"black"}
            mt="3"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            boxShadow={"1px 1px 6px #00000033"}
          >
            <Box
              bg="white"
              h="405px"
              w="100%"
              ref={editorRef}
              overflowY={"scroll"}
              sx={{
                "&::-webkit-scrollbar": {
                  display: "none", 
                },
                scrollbarWidth: "none", 
                "-ms-overflow-style": "none", 
              }}
            >
              <Box display={"flex"} justifyContent={"flex-end"} mb={1}>
                {rephraseData[0] && (
                  <Text
                    onClick={onOpen}
                    cursor="pointer"
                    color="#5AB2FF"
                    fontSize={"14px"}
                    fontWeight={"500"}
                  >
                    Check Your versions here!
                  </Text>
                )}

                {showBookMark &&
                  <BiBookmark onClick={handleSaveData} style={{cursor:"pointer"}}/> 
                  }
                  {
                    showBookMark === false && <MdBookmarkAdded style={{cursor:"pointer"}}/>
                  }
                  

              </Box>
              <Editor
                ref={editor}
                editorState={editorState}
                onChange={onEditorTextChange}
                handlePastedText={handlePastedText}
              />
              {buttonPosition.visible && (
                <Portal>
                  <Box
                    position="absolute"
                    left={`${buttonPosition.x}px`}
                    top={`${buttonPosition.y}px`}
                    display="flex"
                    cursor={"pointer"}
                    zIndex={100}
                  >
                    {["correct", "elaborate", "shorten", "rewrite"].map(
                      (action) => (
                        <Tippy
                          key={action}
                          content={
                            action.charAt(0).toUpperCase() + action.slice(1)
                          }
                        >
                          <Button
                            onClick={() => handleClick(action)}
                            variant="outline"
                            ml={2}
                            bg="white"
                            cursor={"pointer"}
                            _hover={{ bg: "gray.100" }}
                            color={
                              action === "correct"
                                ? "#2f855a" 
                                : action === "elaborate"
                                ? "#d69e2e" 
                                : action === "shorten"
                                ? "#3182ce" 
                                : "#9b2c2c" 
                            }
                            border="1px solid"
                            borderColor={
                              action === "correct"
                                ? "#2f855a" 
                                : action === "elaborate"
                                ? "#d69e2e" 
                                : action === "shorten"
                                ? "#3182ce" 
                                : "#9b2c2c" 
                            }
                          >
                            {action === "correct" && (
                              <FontAwesomeIcon icon={faCheck} color="#2f855a" />
                            )}
                            {action === "elaborate" && (
                              <FontAwesomeIcon
                                icon={faPencilAlt}
                                color="#d69e2e"
                              />
                            )}
                            {action === "shorten" && (
                              <FontAwesomeIcon
                                icon={faCompressAlt}
                                color="#3182ce"
                              />
                            )}
                            {action === "rewrite" && (
                              <FontAwesomeIcon
                                icon={faRedoAlt}
                                color="#9b2c2c"
                              />
                            )}
                          </Button>
                        </Tippy>
                      )
                    )}
                  </Box>
                </Portal>
              )}
            </Box>
            <Box
              display={"flex"}
              width={"100%"}
              justifyContent={"space-between"}
            >
              <Box display={"flex"}>
                <Text mr="5">Character Length: {characterLength}</Text>
                <Text>Word Count: {wordCount}</Text>
              </Box>
              <Box display={"flex"}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  mr="5"
                  cursor={"pointer"}
                  onClick={handleCopy}
                >
                  <BiCopy />
                  <Text ml="1">Copy</Text>
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  cursor={"pointer"}
                  onClick={handleClear}
                >
                  <MdDelete />
                  <Text ml="1">Clear</Text>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
        display={"flex"}
        width={"95%"}
        mt={3}
        justifyContent={"flex-end"}
        
      >
        <Button
          onClick={verifyText}
          color={"white"}
          backgroundColor={"#fd7c47"}
          _hover={{ bg: "#fd7c47" }}
          isLoading={debugButtonLoading}
        >
          Verify
        </Button>
        <Button colorScheme="blue" onClick={handleGenerateSampleTexts} ml={2} isLoading={verifyButtonLoading}>
          Generate
        </Button>
      </Box>
        </Box>
        <Box
          width={"30%"}
          display={"flex"}
          flexDir="column"
          alignItems={"flex-start"}
          h="475px"
          ml="50px"
        >
          <Box
            w="100%"
            h="100%"
            bg="white"
            color={"black"}
            mt="3"
            borderRadius="lg"
            borderLeftRadius={"none"}
            overflow="hidden"
            boxShadow={"1px 1px 6px #00000033"}
          >
            <Box bg="white" w="100%" h="60vh" >
            
            <Box spacing={4} px="4" py="1" overflowY="auto" h="100%" >
                  {aiResult ? (
                    aiResult.map((item, index) => (
                      <Card
                        key={index}
                        bg="gray.100"
                        border="1px solid"
                        borderColor="gray.200"
                        boxShadow="md"
                        borderRadius="md"
                        mt={2}
                        color={"black"}
                      >
                        <CardBody>
                          <Text fontSize="sm" mb="2">
                            <strong>Original:</strong> {item?.original}
                          </Text>
                          <Text fontSize="sm">
                            <strong>Corrected:</strong> {item?.corrected}
                          </Text>
                          <Text fontSize="sm" mt="2">
                            <strong>Rule Violated:</strong> {item?.rule}
                          </Text>
                          <Text fontSize="sm" mt="2">
                            <strong>Example:</strong>
                          </Text>
                          <Text fontSize="sm">
                            <strong>Incorrect:</strong> {item?.example?.incorrect}
                          </Text>
                          <Text fontSize="sm">
                            <strong>Correct:</strong>
                            {item?.example?.correct}
                          </Text>
                          <ChakraTooltip
                            label={"Replace the errored text with correct text"}
                            bg={"black"}
                            color={"white"}
                            borderRadius={"4px"}
                          >
                            <Button
                              size="sm"
                              onClick={() =>
                                handleReplace(item?.original, item?.corrected)
                              }
                              color={"white"}
                              cursor={"pointer"}
                              bg="#5BBCFF"
                              _hover={"blue"}
                              mt={4}
                            >
                              Replace
                            </Button>
                          </ChakraTooltip>
                        </CardBody>
                      </Card>
                    ))
                  ) : (
                    <Text fontSize="sm">
                      No corrections to display or analysis is pending.
                    </Text>
                  )}
                </Box>
            </Box>
          </Box>
        </Box>
        </Box>
      </Box>
    </>
  );
}

export default Playground;

