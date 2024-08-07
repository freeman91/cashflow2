import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';

function DialogTitleOptions(props) {
  const { mode, handleClose, children } = props;

  const [menuAnchor, setMenuAnchor] = useState(null);

  const handleMenuClick = (event) => {
    setMenuAnchor(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  return (
    <Stack
      direction='row'
      spacing={1}
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
      }}
    >
      {mode === 'edit' && children ? (
        <>
          <Card raised>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Card>
          <Menu
            id='settings-menu'
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleCloseMenu}
            MenuListProps={{ disablePadding: true }}
          >
            {children}
          </Menu>
        </>
      ) : null}

      <Card raised>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Card>
    </Stack>
  );
}

DialogTitleOptions.propTypes = {
  mode: PropTypes.string,
  handleClose: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default DialogTitleOptions;
