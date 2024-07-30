import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import './Productos.css';

const ItemType = {
  CHARACTERISTIC: 'characteristic',
};

const Characteristic = ({ characteristic, index, moveCharacteristic, handleEditCharacteristic, handleDeleteCharacteristic, handleChangeCharacteristic, handleBlurCharacteristic, editingIndex }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CHARACTERISTIC,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType.CHARACTERISTIC,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveCharacteristic(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <li ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }} className={isDragging ? 'grabbing' : 'grab'}>
      {editingIndex === index ? (
        <input
          type="text"
          value={characteristic}
          onChange={(e) => handleChangeCharacteristic(e, index)}
          onBlur={() => handleBlurCharacteristic(index)}
        />
      ) : (
        <>
          {characteristic}
          <div className="icon-container">
            <span
              className="edit-icon"
              onClick={() => handleEditCharacteristic(index)}
            >
              ✏️
            </span>
            <span
              className="delete-icon"
              onClick={() => handleDeleteCharacteristic(index)}
            >
              🗑️
            </span>
          </div>
        </>
      )}
    </li>
  );
};

export default Characteristic;
