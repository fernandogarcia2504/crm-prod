
interface CreateButtonProps {
    title: string;
    onClick?: () => void;
}

export default function CreateButton({title, onClick}: CreateButtonProps) {
    
    return(
        <button onClick={onClick} className="w-full sm:w-auto whitespace-nowrap bg-[#232323] hover:bg-[#2F2F2F] hover:shadow-lg py-2 px-4 rounded-md shadow-lg transition duration-300 cursor-pointer">
            {title}
        </button>
    )
}