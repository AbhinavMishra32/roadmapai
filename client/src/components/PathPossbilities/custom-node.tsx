import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Briefcase, Book, Code, Server, Cloud, Users, School, Building2, LineChart } from 'lucide-react'

const icons = {
  briefcase: Briefcase,
  book: Book,
  code: Code,
  server: Server,
  cloud: Cloud,
  users: Users,
  school: School,
  building: Building2,
  chart: LineChart,
}

function CustomNode({ data, isConnectable }: { 
  data: { 
    label: string
    icon?: string
    description: string
    timeEstimate: string
    nextSteps?: string[]
    isExpanded?: boolean
    isHighlighted?: boolean
  }
  isConnectable: boolean 
}) {

  const IconComponent = data.icon && icons[data.icon as keyof typeof icons] ? icons[data.icon as keyof typeof icons] : Briefcase

  return (
    <div
      className={`group relative px-4 py-3 shadow-md dark:shadow-[0_5px_60px_-15px_rgba(154,157,241,0.2)] rounded-lg border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        data.isHighlighted ? 'border-red-400 dark:border-indigo-500 bg-red-50 dark:bg-indigo-700/10 backdrop-blur-sm' : 'border-gray-200 dark:border-neutral-700 dark:border-2 bg-white dark:bg-neutral-900/10 backdrop-blur-sm'
      } ${data.isExpanded ? 'scale-110 shadow-lg dark:shadow-2xl' : ''}`}
      style={{
        width: data.isExpanded ? '240px' : '220px',
        fontSize: '3.75rem',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className={`!w-3 !h-3 !-left-1.5 !border-2 !border-white ${
          data.isHighlighted ? '!bg-red-400 dark:!bg-indigo-600' : '!bg-yellow-400 dark:!bg-indigo-500'
        }`}
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${data.isHighlighted ? 'bg-red-100 dark:bg-indigo-200' : 'bg-gray-100 dark:bg-indigo-100'}`}>
            <IconComponent className={`w-4 h-4 ${data.isHighlighted ? 'text-red-600 dark:text-black' : 'text-gray-600 dark:text-black'}`} />
          </div>
          <h2 className={`text-sm font-semibold ${data.isHighlighted ? 'text-red-800 dark:text-white' : 'text-gray-800 dark:text-white'}`}>{data.label}</h2>
        </div>

        <div className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
          {data.description}
        </div>

        <div className="text-xs">
          <span className="font-medium text-gray-700 dark:text-gray-400">Time:</span>
          <span className="ml-1 text-gray-600 dark:text-gray-400">{data.timeEstimate}</span>
        </div>

        {data.nextSteps && (
          <div className="flex gap-1 flex-wrap mt-1">
            {data.nextSteps.map((step, index) => (
              <span 
                key={index}
                className={`px-2 py-0.5 rounded-full text-xs font-medium dark:border-indigo-900 dark:border-[1px] backdrop-blur-3xl ${
                  data.isHighlighted ? 'bg-red-100 dark:bg-indigo-900/50 text-red-800 dark:text-gray-200' : 'bg-yellow-100 dark:bg-indigo-900/30 text-yellow-800 dark:text-gray-300'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className={`!w-3 !h-3 !-right-1.5 !border-2 !border-white ${
          data.isHighlighted ? '!bg-red-400 dark:!bg-indigo-600' : '!bg-yellow-400 dark:!bg-indigo-500'
        }`}
      />
    </div>
  )
}

export default memo(CustomNode)

