import React from "react";
import Milestone from "../components/Milestone";

const charityDetails1 = {
    name: "Save the Ocean Foundation",
    description: "A charity focused on protecting marine life and reducing plastic waste in oceans.",
    milestone: {
        address: "0x872C949d3C0F0e782D71A0A744B513744897B2e8", 
        goal: "0.5",
        description: "Fund for beach clean-up activities and awareness programs.",
    },
};

const charityDetails2 = {
    name: "Children's Education Fund",
    description: "A charity that provides educational resources and scholarships for underprivileged children around the world.",
    milestone: {
        address: "0x8ef9255fF463C551C74c5352c251b896B45fe2bf", 
        goal: "0.3",
        description: "Fund scholarships and build schools in underserved communities.",
    },
};

const charityDetails3 = {
    name: "Forest Conservation Initiative",
    description: "An organization dedicated to preserving forests and promoting sustainable land use practices.",
    milestone: {
        address: "0xC9A19BAe299d3A232Ecb6985feB3b0479c574570",
        goal: "10",
        description: "Support forest restoration projects and sustainable agriculture initiatives.",
    },
};


const Charities = () => {
    return (
        <div>
            <Milestone charityDetails={charityDetails1} />
            <Milestone charityDetails={charityDetails2} /> 
            <Milestone charityDetails={charityDetails3} /> 
        </div>
    )
};


export default Charities;
export { charityDetails1, charityDetails2, charityDetails3 };
