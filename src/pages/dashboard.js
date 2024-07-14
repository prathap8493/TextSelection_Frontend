import Header from '@/components/Header';
import { GetUserTextService } from '@/services/api';
import { Box, CircularProgress, CircularProgressLabel, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { MdDelete, MdMoreHoriz } from 'react-icons/md';
import document_icon from "@/assets/document-icon.svg"
import Image from 'next/image';
function Dashboard() {

    const [userTexts,setUsertexts] = useState([])
    const [dayCount, setDayCount] = useState(0);
    const [weekCount, setWeekCount] = useState(0);
    const [hoverDay, setHoverDay] = useState(false);
    const [hoverWeek, setHoverWeek] = useState(false);

    const getUserTexts = async() =>{
        try{
            const res = await GetUserTextService();
            if(res?.status){
                setUsertexts(res?.data)
                setDayCount(res?.day_count);
                setWeekCount(res?.week_count);
            }

        }
        catch(error){       
            console.log("Something went wrong!")
        }
    }
    useEffect(()=>{
        getUserTexts();
    },[])
    return (
        <>
            <Header/>

            <Box width={"100%"} display={"flex"} px="50px">
                <Box mt="50px" width="70%" pl="50px" >
                    <Box width={"90%"}  borderBottom={"1px solid #e2e8f0"}>
                        <Text fontSize={"24px"} fontWeight={"600"} pb="2">Uploaded Texts</Text>
                    </Box>
                    <Box width={"100%"}  mt="5">
                    
                        {
                            userTexts?.map((item)=>(
                                <Box display={"flex"} width={"100%"} alignItems={"center"} mt="5">
                                    <Box width={"90%"} pr="10px">
                                        <Box display={"flex"} alignItems={"center"}>
                                            <Box width={"80px"}>
                                                <Image src={document_icon}/>
                                            </Box>
                                            <Text noOfLines={1} ml="2px" fontSize={"16px"} fontWeight={"400"} cursor={"pointer"}>
                                                {item?.text}
                                            </Text>
                                        </Box>
                                    </Box>
                                    <Box width={"10%"}>
                                        <MdDelete style={{cursor:"pointer"}}/>
                                    </Box>
                                </Box>
                            ))
                        }
                    
                    </Box>
                </Box>
                <Box display="flex" justifyContent="space-around" mt="70px" width={"30%"} >
                    <Box onMouseEnter={() => setHoverDay(true)} onMouseLeave={() => setHoverDay(false)}>
                        <CircularProgress value={dayCount} color="green.400" size="100px">
                            {hoverDay && <CircularProgressLabel fontSize={"12px"} fontWeight={500}>{dayCount} uploads</CircularProgressLabel>}
                        </CircularProgress>
                        <Text mt="2" fontSize={"14px"} fontWeight={600}>Daily uploads</Text>
                    </Box>
                    <Box onMouseEnter={() => setHoverWeek(true)} onMouseLeave={() => setHoverWeek(false)}>
                        <CircularProgress value={weekCount} color="orange.400" size="100px">
                            {hoverWeek && <CircularProgressLabel fontSize={"12px"} fontWeight={"500"}>{weekCount} uploads</CircularProgressLabel>}
                        </CircularProgress>
                        <Text mt="2" fontSize={"14px"} fontWeight={600}>Weekly uploads</Text>
                    </Box>
                </Box>
            </Box>
            
        </>
    )
}

export default Dashboard