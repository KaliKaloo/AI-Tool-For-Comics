import { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import GeneratePanel from "./GeneratePanel";
import styles from "../../assets/style";
import {
  DndContext,
  closestCenter,
  useSensors,
  useSensor,
  PointerSensor,
} from "@dnd-kit/core";
import { Draggable } from "../../components/ui/Draggable";
import { Droppable } from "../../components/ui/Droppable";
import {
  RectangleGroupIcon,
  ChatBubbleBottomCenterIcon,
  PlusIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

function CreateComicPage() {
  const [panelList, setPanels] = useState([]);
  const [count, setCount] = useState(1);
  const [newPage, setNewPage] = useState(false);

  const addPanel = (shape) => {
    setPanels([
      ...panelList,
      { id: count, position: { x: 100, y: 100 }, shape: shape },
    ]);
    setCount(count + 1);
  };

  const deletePanel = (id) => {
    setPanels(panelList.filter((panel) => panel.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 8,
      },
    })
  );

  function handleDragEnd(ev) {
    const panel = panelList.find((x) => x.id === ev.active.id);
    panel.position.x += ev.delta.x;
    panel.position.y += ev.delta.y;
    const _panelList = panelList.map((x) => {
      if (x.id === panel.id) return panel;
      return x;
    });
    setPanels(_panelList);
  }

  return (
    <MainLayout footer="noFooter">
      <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
        <div className="bg-[#f0efeb] relative h-[calc(100vh-56px)] items-center">
          <div
            className={`z-20 flex shrink-0 grow-0 justify-around gap-4 border-t border-gray-200 bg-white/50 p-2.5 shadow-lg backdrop-blur-lg  fixed top-2/4 -translate-y-2/4 left-3 min-h-[auto] lg:min-w-[64px] min-w-[40px] flex-col rounded-lg border`}
          >
            <div>
              <RectangleGroupIcon
                onClick={() => addPanel("square")}
                className="flex aspect-square min-h-[32px] lg:w-16 w-10 flex-col items-center justify-center gap-1 rounded-md p-1.5  text-gray-700 hover:bg-gray-100 "
              />
              <PlusCircleIcon
                onClick={() => addPanel("circle")}
                className="flex aspect-square min-h-[32px] lg:w-16 w-10 flex-col items-center justify-center gap-1 rounded-md p-1.5  text-gray-700 hover:bg-gray-100 "
              />
            </div>
          </div>

          <div
            className={`flex ${
              newPage ? "justify-start ml-20 " : "justify-center"
            } flex-1 p-12 h-[calc(100vh-56px)] overflow-x-auto`}
          >
            <Droppable>
              {/* THE COMIC PAGEs */}
              <div
                id="page1"
                className="flex-shrink-0 relative shadow-md bg-white md:w-[210mm] w-[calc(210mm*0.9)] h-[calc(297mm*0.9)] md:h-[297mm] "
              >
                <button className="font-poppins text-sm absolute top-0 left-0 mt-[-1.6em] text-left hover:text-lightGreen w-20 h-5 text-gray-600">
                  Page size v
                </button>
                {!newPage ? (
                  <PlusIcon
                    onClick={() => setNewPage(true)}
                    className="absolute top-0 right-0 mt-[-1.5em] hover:bg-[#e0dfdb] rounded-full w-5 h-5"
                  />
                ) : (
                  <XMarkIcon
                    onClick={() => setNewPage(false)}
                    className="absolute top-0 right-[-2.4rem] mt-[-1.5em] hover:bg-[#e0dfdb] rounded-full w-5 h-5"
                  />
                )}

                {newPage ? (
                  <div className=" absolute md:ml-[215mm] ml-[195mm] shadow-md bg-white md:w-[210mm] w-[calc(210mm*0.9)] h-[calc(297mm*0.9)] md:h-[297mm]"></div>
                ) : (
                  <></>
                )}

                {panelList.map((panel) => (
                  <Draggable
                    styles={{
                      position: "absolute",
                      left: `${panel.position.x}px`,
                      top: `${panel.position.y}px`,
                    }}
                    id={panel.id}
                    key={panel.id}
                    panel={panel}
                  >
                    <div className={``}>
                      <GeneratePanel
                        deleteFunc={() => deletePanel(panel.id)}
                        shape={panel.shape}
                      />
                    </div>
                  </Draggable>
                ))}
              </div>
            </Droppable>
          </div>
        </div>
      </DndContext>
    </MainLayout>
  );
}

export default CreateComicPage;
