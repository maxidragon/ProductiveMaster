import { useEffect, useState } from "react";
import GoalsList from "../../Components/Goals/GoalsList";
import { Goal } from "../../logic/interfaces";
import { getAllGoals } from "../../logic/goals";

const Goals = () => {
    const [goals, setGoals] = useState<Goal[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllGoals();
            setGoals(data);
        };
        fetchData();
    }, []);
    return (
        <>
            <GoalsList goals={goals} />
        </>
    )
};

export default Goals;