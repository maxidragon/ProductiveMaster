import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useState } from "react";
import { GoalCategory } from "../../logic/interfaces";

const GoalCategorySelect = (props: {
    goalCategories: GoalCategory[];
    onChange: any;
}) => {
    const [selected, setSelected] = useState<GoalCategory>({
        id: 0,
        title: "",
    });
    const handleChange = (event: any) => {
        const goalCategory = props.goalCategories.find(
            (goalCategory) => goalCategory.id === event.target.value
        );
        if (goalCategory) {
            setSelected(goalCategory);
            props.onChange(goalCategory.id);
        }
    };
    return (
        <FormControl fullWidth>
            <InputLabel id="goal-category-select-label">
                Goal Category
            </InputLabel>
            <Select
                labelId="goal-category-select-label"
                id="goal-category-select"
                value={selected.id}
                label="Goal Category"
                onChange={handleChange}
            >
                {props.goalCategories.map((goalCategory: GoalCategory) => (
                    <MenuItem key={goalCategory.id} value={goalCategory.id}>
                        {goalCategory.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default GoalCategorySelect;