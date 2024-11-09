import React from "react";
import Milestone from "../components/Milestone";

const charityDetails1 = {
    name: "Save the Ocean Foundation",
    description: "A charity focused on protecting marine life and reducing plastic waste in oceans.",
    milestone: {
        address: "0x8bf3b9210d70d56ce176b7caad60d57a2e18244d", // Replace with actual milestone contract address if testing on blockchain
        goal: "0.3",
        description: "Fund for beach clean-up activities and awareness programs.",
    },
};

const charityDetails2 = {
    name: "Children's Education Fund",
    description: "A charity that provides educational resources and scholarships for underprivileged children around the world.",
    milestone: {
        address: "0xC2c6c814F60d9053186060d35e0bD3086C3D173E", // Replace with actual milestone contract address if testing on blockchain
        goal: "1.0",
        description: "Fund scholarships and build schools in underserved communities.",
    },
};

const charityDetails3 = {
    name: "Forest Conservation Initiative",
    description: "An organization dedicated to preserving forests and promoting sustainable land use practices.",
    milestone: {
        address: "0x204a3aE7B6921100655640eD3cB42ED533f3EF74", // Replace with actual milestone contract address if testing on blockchain
        goal: "0.5",
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
