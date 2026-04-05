import React from 'react'

const FilesLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)  => {
  return (
    <div>
        {/* sidebar */}
      {children}
    </div>
  )
}

export default FilesLayout
