import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Text,
    DrawerCloseButton,
    useDisclosure,
    Skeleton,
  } from "@chakra-ui/react";
  import Image from "next/image";
  import React, { useEffect, useRef, useState } from "react";
  
  import Link from "next/link";
  import Session from "supertokens-web-js/recipe/session";
  import { Button } from "@chakra-ui/react";
  import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
  } from "@chakra-ui/react";
  import { useDispatch } from "react-redux";
  import { useSelector } from "react-redux";
    
  import dynamic from "next/dynamic";
  import { useRouter } from "next/router";
  import {toast} from "react-hot-toast";
import { DESTROY_SESSION } from "@/redux/types";
  import logo from "@/assets/new_logo.png"
  const UserDetails = dynamic(() => import("./UserDetails"), {
    ssr: true,
    loading: () => (
      <Skeleton
        w={["160px"]}
        h={"24px"}
        count={1}
        endColor="#fffefc"
        mx={"auto"}
        borderRadius={"6px"}
      />
    ),
  });
  
  function Header() {
    const {
      isOpen: isOpenSideBar,
      onOpen: onOpenSideBar,
      onClose: onCloseSideBar,
    } = useDisclosure();
  
    const router = useRouter();
    const drawerRef = useRef();
    const { locale, asPath } = useRouter();
    const openAuthModal = () => {
      dispatch(showLogin(true));
    };
  
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user);
    
    const openPricingModal = () => {
      dispatch(showPricing(true));
    };
  
    async function logout() {
      dispatch({ type: DESTROY_SESSION });
      await Session.signOut();
      toast.success("You will be missed 😞", {duration: "2000"});
      router.push("/");
      window.postMessage({ type: "LOGOUT" }, "*");
      fetchChats();
      // if (window.$crisp) {
      // }
    }
  
    return (
      <>
        <Box
          w={["90%", "90%", "81%"]}
          pb={5}
          px={["20px", "40px", "40px", "0px"]}
          gap={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mx={"auto"}
          mt={["15px"]}
        >
          <Box w={["170px", "180px"]}>
            <Link href={"/"}>
              <Image src={logo} alt="ChatWithPDF" title="ChatWithPDF"/>
            </Link>
          </Box>
  
          <Box display={"flex"}>
            <Box
              display={["none", "none", "none", "flex"]}
              alignItems={"center"}
              gap={"28px"}
            >
              {/* {userData?.userId && chats?.length > 0 && ( */}
              <Link href="/dashboard">
                <Text fontWeight={500}>My Dashboard</Text>
              </Link>
              {/* )} */}
              <UserDetails />
            </Box>
  
            <Button
              ref={drawerRef}
              onClick={onOpenSideBar}
              bg="transparent"
              display={["initial", "initial", "initial", "none"]}
            >
              {/* <HamburgerIcon style={{ fontSize: "24px" }} /> */}
            </Button>
  
            <Drawer
              isOpen={isOpenSideBar}
              placement="left"
              onClose={onCloseSideBar}
              finalFocusRef={drawerRef}
            >
              <DrawerOverlay />
              {userData?.email ? (
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>ChatWithPdf</DrawerHeader>
                  <DrawerBody>
                    <Box>👋 Hey,{userData?.email?.split("@")[0]}</Box>
                    <Box mt="20px">
                      <Text>{userData?.email}</Text>
                    </Box>
                    <Link href="/subscription">
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        marginTop={"10px"}
                      >
                        <Text color="#b83a34" fontSize={"16px"}>
                          Your Subscription
                        </Text>
                      </Box>
                    </Link>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      marginTop={"10px"}
                      onClick={logout}
                    >
                      {/* <LogoutIcon
                        style={{
                          fontSize: "20px",
                          marginRight: "5px",
                          color: "#b83a34",
                        }}
                      /> */}
                      <Text color="#b83a34" fontSize={"16px"}>
                        LogOut
                      </Text>
                    </Box>
                  </DrawerBody>
                </DrawerContent>
              ) : (
                <DrawerContent>
                  <DrawerCloseButton />
                  <DrawerHeader>ChatWithPdf</DrawerHeader>
                  <DrawerBody>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      mb="20px"
                      onClick={openAuthModal}
                      cursor={"pointer"}
                    >
                      {/* <LoginIcon
                        style={{ marginRight: "5px", fontSize: "20px" }}
                      /> */}
                      <Text fontSize={"16px"}>Login/Register</Text>
                    </Box>
                    {/* <Box mt={5}>
                      <MobileInternationalize
                        locale={locale}
                        i18={i18}
                        asPath={asPath}
                      />
                    </Box> */}
                  </DrawerBody>
                </DrawerContent>
              )}
            </Drawer>
  
          </Box>
        </Box>
      </>
    );
  }
  
  export default Header;
  
  
  
  