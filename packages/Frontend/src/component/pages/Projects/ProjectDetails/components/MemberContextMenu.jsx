"use client";

import { useState } from "react";
import { useProject } from "../../../../../hooks/projects/useProject";

const MemberContextMenu = ({ children, memberId, userId, projectId }) => {
  const [menu, setMenu] = useState(null);

  const { kickMember, kickUserLoading } = useProject();

  const onKick = () => {
    kickMember({
      userId,
      projectId,
      memberId,
    });
  };

  const openMenu = (e) => {
    e.preventDefault();
    setMenu({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const closeMenu = () => setMenu(null);

  return (
    <>
      <div onContextMenu={openMenu} onClick={closeMenu}>
        {children}
      </div>

      {menu && (
        <div
          style={{ top: menu.y, left: menu.x }}
          className="fixed z-50 rounded-xl border bg-white dark:bg-[#1f1f1f] shadow-lg"
        >
          <button
            disabled={kickUserLoading}
            onClick={() => {
              onKick();
              closeMenu();
            }}
            className="w-full px-4 py-2 text-left text-base text-red-600 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] disabled:opacity-50"
          >
            Kick user
          </button>
        </div>
      )}
    </>
  );
};

export default MemberContextMenu;
