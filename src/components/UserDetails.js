import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import Session from "supertokens-web-js/recipe/session";
import Link from "next/link";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {toast} from "react-hot-toast";
import { useRouter } from "next/router";
import { showLogin, showPricing } from "@/redux/reducer/modals";
import { DESTROY_SESSION } from "@/redux/types";

function UserDetails() {
  const router = useRouter();
  const userData = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const openPricingModal = () => {
    dispatch(showPricing(true));
  };

  const openAuthModal = () => {
    dispatch(showLogin(true));
  };

  async function logout() {
    dispatch({ type: DESTROY_SESSION });
    await Session.signOut();
    toast.success("You will be missed 😞");
    router.push("/");
    window.postMessage({ type: "LOGOUT" }, "*");
  }

  const [isHydrated,setIsHydrated] = useState(false)
  useEffect(()=>{
    setIsHydrated(true)
  },[])

  console.log(userData,"lsdk")
  return (
    <Flex gap={3} align={"center"} justify={"center"}>
      {/* {(!subscriptionData ||
        subscriptionData.filter((item) => item.is_active).length === 0) && (
        <Button
          fontWeight={600}
          onClick={openPricingModal}
          cursor={"pointer"}
          display={"flex"}
          alignItems={"center"}
          gap={"2"}
          bg={"var(--primary-color)"}
          color={"#fff"}
          borderRadius={"6px"}
          _hover={{ bg: "var(--hover-color)", color: "var(--white)" }}
        >
          <AutoAwesomeOutlined style={{ fontSize: "18px" }} />
          Premium
        </Button>
      )} */}

      {!userData?.email ? (
        <Button
          onClick={openAuthModal}
          cursor={"pointer"}
          bg={"var(--white)"}
          // color={"#fff"}
          borderRadius={"6px"}
          fontWeight={600}
          type="group"
          _hover={{ bg: "var(--secondary-background-color)" }}
          border={"1px solid var(--border-color)"}
        >
          <Box display={"flex"} alignItems={"center"}>
            <Text fontWeight={600}>Login / Register</Text>
          </Box>
        </Button>
      ) : (
        <>
          <Menu>
            <MenuButton display={["none", "none", "none", "initial"]}>
              <MenuItem>
                👋 Hey,{userData?.email?.split("@")[0]}
                {/* <ChevronDownIcon style={{ fontSize: "25px" }} /> */}
              </MenuItem>
            </MenuButton>
            <MenuList>
              <MenuGroup>
                <MenuItem>
                  <Box display={"flex"} alignItems={"center"} gap="5px">
                    <Box>
                      <Avatar
                        size="md"
                        name={userData?.email?.split("@")[0]}
                        src="https://bit.ly/broken-link"
                      />
                    </Box>
                    <Box>
                      <Text fontSize={"16px"}>
                        {userData?.email?.split("@")[0]}
                      </Text>
                      <Text fontSize={"13px"}>{userData?.email}</Text>
                    </Box>
                  </Box>
                </MenuItem>
                {/* <Link href="/subscription">
                  <MenuItem>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      marginTop={"10px"}
                    >
                      <Text color="#b83a34" fontSize={"16px"}>
                        Your Subscription
                      </Text>
                    </Box>
                  </MenuItem>
                </Link> */}
                <MenuItem onClick={logout}>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    marginTop={"10px"}
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
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </>
      )}
    </Flex>
  ) 
}

export default UserDetails;
