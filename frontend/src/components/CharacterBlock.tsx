import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import "./CharacterBlock.css";
import { useNavigate } from "react-router-dom";

interface CharacterBlockProps {
  nickname: string;
  image: string;
}

const CharacterBlock: React.FC<CharacterBlockProps> = ({ nickname, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/character/${nickname}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{ maxWidth: 345, margin: 2, position: "relative", overflow: "hidden" }}
      className="character-card"
    >
      <CardMedia component="img" height="140" image={image} alt={nickname} />
      <CardContent
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          padding: "8px",
          "&:last-child": { padding: "8px" },
        }}
      >
        <Typography variant="subtitle2" component="div" color="white">
          {nickname}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CharacterBlock;
