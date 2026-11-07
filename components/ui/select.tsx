import React, { useEffect, useState } from "react"
import { AnimatePresence, motion, MotionConfig } from "framer-motion"
import { ChevronDownIcon, X } from "lucide-react"

export type TSelectData = {
  id: string
  label: string
  value: string
  description?: string
  icon?: string | React.ReactNode
  disabled?: boolean
  custom?: React.ReactNode
}

export type SelectProps = {
  data?: TSelectData[]
  onChange?: (value: string) => void
  defaultValue?: string
}

export const Select = ({ data, defaultValue }: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<TSelectData | undefined>(undefined)

  useEffect(() => {
    if (defaultValue) {
      const item = data?.find((i) => i.value === defaultValue)
      if (item) {
        setSelected(item)
      }
    } else {
      setSelected(data?.[0])
    }
  }, [defaultValue, data])

  const onSelect = (value: string) => {
    const item = data?.find((i) => i.value === value)
    setSelected(item as TSelectData)
    setOpen(false)
  }

  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <motion.div className="flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {!open ? (
            <motion.div
              whileTap={{ scale: 0.95 }}
              animate={{
                borderRadius: 30,
              }}
              layout
              layoutId="dropdown"
              onClick={() => setOpen(true)}
              className="overflow-hidden rounded-[30px] border border-sky/30 bg-[#0a1d40]/95 backdrop-blur-xl shadow-lg cursor-pointer"
            >
              <SelectItem item={selected} />
            </motion.div>
          ) : (
            <motion.div
              layout
              animate={{
                borderRadius: 20,
              }}
              layoutId="dropdown"
              className="overflow-hidden rounded-[20px] w-[380px] border border-sky/30 bg-[#0a1d40]/95 backdrop-blur-xl py-2 shadow-2xl text-cream"
              ref={ref}
            >
              <Head setOpen={setOpen} />
              <div className="w-full overflow-y-auto max-h-[320px]">
                {data?.map((item) => (
                  <SelectItem
                    order={item?.value}
                    noDescription={false}
                    key={item.id}
                    item={item}
                    onChange={onSelect}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  )
}

export default Select

const Head = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        delay: 0.1,
      }}
      layout
      className="flex items-center justify-between border-b border-white/10 px-4 py-2.5"
    >
      <motion.strong layout className="text-sm font-bold tracking-wide text-white">
        Select Option
      </motion.strong>
      <button
        onClick={() => setOpen(false)}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 hover:bg-sky/30 text-white transition-colors"
      >
        <X className="text-white" size={12} />
      </button>
    </motion.div>
  )
}

type SelectItemProps = {
  item?: TSelectData
  noDescription?: boolean
  order?: string
  onChange?: (index: string) => void
}

const animation = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 0.15,
    },
  },
}

const SelectItem = ({
  item,
  noDescription = true,
  order,
  onChange,
}: SelectItemProps) => {
  return (
    <motion.div
      className={`group flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-sky/20 ${
        noDescription && "!p-2.5"
      }`}
      variants={animation}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={"product-" + item?.id + "-order-" + order}
      custom={order}
      onClick={() => onChange?.(order as string)}
    >
      <div className="flex items-center gap-3">
        <motion.div
          layout
          layoutId={`icon-${item?.id}`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky/30 bg-sky/15 text-sky group-hover:border-sky group-hover:bg-sky group-hover:text-ink transition-colors"
        >
          {item?.icon}
        </motion.div>
        <motion.div layout className="flex w-52 flex-col">
          <motion.strong
            layoutId={`label-${item?.id}`}
            className="text-sm font-semibold text-white group-hover:text-sky transition-colors"
          >
            {item?.label}
          </motion.strong>
          {noDescription ? null : (
            <span className="truncate text-xs text-cream/60">
              {item?.description}
            </span>
          )}
        </motion.div>
      </div>
      {noDescription ? (
        <motion.div
          layout
          className="flex items-center justify-center gap-2 pr-2"
        >
          <ChevronDownIcon className="text-sky" size={18} />
        </motion.div>
      ) : null}
    </motion.div>
  )
}

