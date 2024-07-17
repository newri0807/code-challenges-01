import React, {useState, useEffect} from "react";

type ButtonState = string | "loading" | "success";

interface SubmitButtonProps {
    onClick: () => Promise<void>;
    idleText: string;
    loadingText?: string;
    successText?: string;
    className?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({onClick, idleText, loadingText = "Loading...", successText = "Success 👌", className = ""}) => {
    const [buttonState, setButtonState] = useState<ButtonState>(idleText);

    useEffect(() => {
        if (buttonState === "success") {
            const timer = setTimeout(() => {
                setButtonState(idleText);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [buttonState, idleText]);

    const handleClick = async () => {
        setButtonState("loading");
        try {
            await onClick();
            setButtonState("success");
        } catch (error) {
            setButtonState(idleText);
        }
    };

    const getButtonText = () => {
        switch (buttonState) {
            case "loading":
                return loadingText;
            case "success":
                return successText;
            default:
                return buttonState;
        }
    };

    return (
        <button type="submit" disabled={buttonState === "loading" || buttonState === "success"} className={className} onClick={handleClick}>
            {getButtonText()}
        </button>
    );
};

export default SubmitButton;
