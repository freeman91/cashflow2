import React, { useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

export default function Subcategory(props) {
  const {
    subcategory,
    subIdx,
    selectedSubcategory,
    setSelectedSubcategory,
    updateSubactegory,
    deleteSubcategory,
  } = props;

  const [subcategoryText, setSubcategoryText] = useState(subcategory);

  const handleChange = (value) => {
    setSubcategoryText(value);
  };

  const onSave = (e) => {
    e.preventDefault();
    updateSubactegory(subcategoryText, subIdx);
    setSelectedSubcategory(null);
  };

  const selected = selectedSubcategory === subcategory;
  return (
    <>
      <form key={subcategory} onSubmit={onSave}>
        <TextField
          fullWidth
          variant='standard'
          sx={{ px: 2, py: 1, cursor: selected ? 'default' : 'pointer' }}
          placeholder='subcategory'
          key={subcategory}
          id='subcategory'
          value={subcategoryText}
          onChange={(e) => handleChange(e.target.value)}
          onClick={() => {
            if (!selected) {
              setSelectedSubcategory(subcategory);
            }
          }}
          slotProps={{
            input: {
              disableUnderline: !selected,
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    onClick={
                      selected ? onSave : () => deleteSubcategory(subcategory)
                    }
                    color='info'
                  >
                    {selected ? <SaveIcon /> : <DeleteIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </form>
    </>
  );
}
