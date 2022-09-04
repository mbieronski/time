import React from 'react';

type ModalItemProps = {
  title: string;
  content?: string;
};

function ModalItem(props: ModalItemProps) {
  const { title, content } = props;

  if (!content) return null;

  return (
    <div style={{ marginTop: '10px' }}>
      <span>
        <strong>{`${title}: `}</strong>
      </span>
      <span>{content}</span>
    </div>
  );
}

export default ModalItem;
