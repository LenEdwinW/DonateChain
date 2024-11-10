import React from "react";
import { Card, Button, Icon } from "semantic-ui-react";

const DonationCard = ({ charity, amount, etherscanLink }) => {
    // Log the Etherscan link to the console
    console.log("Etherscan Link:", etherscanLink);

    return (
        <Card fluid>
            <Card.Content>
                <Card.Header>{charity}</Card.Header>
                <Card.Meta>Amount Donated: {amount} ETH</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                {etherscanLink ? (
                    <Button as="a" href={etherscanLink} target="_blank" rel="noopener noreferrer">
                        View Transaction on Etherscan <Icon name="external" />
                    </Button>
                ) : (
                    <p>Transaction details not available.</p>
                )}
            </Card.Content>
        </Card>
    );
};

export default DonationCard;
