import React, { useEffect } from "react";
import { ChatProvider, useChatContext } from "./ChatContext";
import Chat from "./Chat";

const chatContainerStyle = {
  position: "relative",
  height: "100%",
  overflow: "hidden",
};

const ChatWrapper = (props) => {
  const handleWheel = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    const openChatHandler = () => {
      console.log("Open chat event received");
      if (props.toggleChat) {
        props.toggleChat(true);
      }

      setTimeout(() => {
        const chatDrawers = document.querySelectorAll(".chat-drawer");
        chatDrawers.forEach((drawer) => {
          drawer.style.display = "block";
          drawer.style.opacity = "1";
          drawer.style.visibility = "visible";
        });

        const paperElements = document.querySelectorAll(".MuiDrawer-paper");
        paperElements.forEach((paper) => {
          paper.style.display = "block";
          paper.style.opacity = "1";
          paper.style.visibility = "visible";
        });
      }, 50);
    };

    document.addEventListener("openChatRequested", openChatHandler);

    if (props.isOpen === true) {
      openChatHandler();
    }

    const chatRoot = document.querySelector(".chat-root");

    if (chatRoot) {
      const preventScroll = (e) => {
        const target = e.target;
        const isAtTop = target.scrollTop <= 0;
        const isAtBottom =
          target.scrollTop + target.clientHeight >= target.scrollHeight;

        if (!(isAtTop && e.deltaY < 0) && !(isAtBottom && e.deltaY > 0)) {
          e.stopPropagation();
        }
      };

      chatRoot.addEventListener("wheel", preventScroll, { passive: false });
      chatRoot.addEventListener("touchmove", preventScroll, { passive: false });

      const addCloseButtonHandlers = () => {
        setTimeout(() => {
          const closeButtons = document.querySelectorAll(".chat-close-button");
          closeButtons.forEach((button) => {
            const oldClone = button.cloneNode(true);
            if (button.parentNode) {
              button.parentNode.replaceChild(oldClone, button);
            }

            oldClone.addEventListener(
              "click",
              (e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log("Close button clicked");

                if (props.toggleChat) {
                  props.toggleChat(false);
                } else {
                  const chatProvider =
                    document.querySelector(".chat-root").__REACT_CONTEXT_VALUE;
                  if (chatProvider && chatProvider.toggleChat) {
                    chatProvider.toggleChat(false);
                  }
                }

                document.dispatchEvent(new CustomEvent("closeChatRequested"));

                const chatDrawers = document.querySelectorAll(".chat-drawer");
                chatDrawers.forEach((drawer) => {
                  drawer.style.display = "none";
                });

                const backdrops =
                  document.querySelectorAll(".MuiBackdrop-root");
                backdrops.forEach((backdrop) => {
                  backdrop.style.display = "none";
                });
              },
              true
            );
          });
        }, 100); 
      };

      const documentClickHandler = (e) => {
        const chatContainer = document.querySelector(".chat-container");
        const chatFab = document.querySelector(".chat-toggle-button");
        const isOutsideChat =
          chatContainer &&
          !chatContainer.contains(e.target) &&
          !chatFab?.contains(e.target);
        const isChatOpen = document.querySelector(".chat-drawer") !== null;

        if (isOutsideChat && isChatOpen) {
          console.log("Clicked outside chat, closing");

          if (props.toggleChat) {
            props.toggleChat(false);
          }

          document.dispatchEvent(new CustomEvent("closeChatRequested"));

          const chatDrawers = document.querySelectorAll(".chat-drawer");
          chatDrawers.forEach((drawer) => {
            drawer.style.display = "none";
          });
        }
      };

      document.body.addEventListener("click", documentClickHandler);

      addCloseButtonHandlers();

      const observer = new MutationObserver(() => {
        addCloseButtonHandlers();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"],
      });

      return () => {
        chatRoot.removeEventListener("wheel", preventScroll);
        chatRoot.removeEventListener("touchmove", preventScroll);
        document.body.removeEventListener("click", documentClickHandler);
        observer.disconnect();
        document.removeEventListener("openChatRequested", openChatHandler);
      };
    }
  }, [props]);

  return (
    <div style={chatContainerStyle} className="chat-root" onWheel={handleWheel}>
      <ChatProvider>
        <Chat {...props} />
      </ChatProvider>
    </div>
  );
};

export default ChatWrapper;
