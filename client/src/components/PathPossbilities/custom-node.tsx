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
      className={`group relative px-4 py-3 shadow-md rounded-lg border transition-all duration-300 hover:shadow-lg hover:scale-105 ${
        data.isHighlighted ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
      } ${data.isExpanded ? 'scale-110 shadow-lg' : ''}`}
      style={{
        width: data.isExpanded ? '240px' : '220px',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className={`!w-3 !h-3 !-left-1.5 !border-2 !border-white ${
          data.isHighlighted ? '!bg-red-400' : '!bg-yellow-400'
        }`}
      />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${data.isHighlighted ? 'bg-red-100' : 'bg-gray-100'}`}>
            <IconComponent className={`w-4 h-4 ${data.isHighlighted ? 'text-red-600' : 'text-gray-600'}`} />
          </div>
          <h2 className={`text-sm font-semibold ${data.isHighlighted ? 'text-red-800' : 'text-gray-800'}`}>{data.label}</h2>
        </div>

        <div className="text-xs text-gray-600 leading-relaxed">
          {data.description}
        </div>

        <div className="text-xs">
          <span className="font-medium text-gray-700">Time:</span>
          <span className="ml-1 text-gray-600">{data.timeEstimate}</span>
        </div>

        {data.nextSteps && (
          <div className="flex gap-1 flex-wrap mt-1">
            {data.nextSteps.map((step, index) => (
              <span 
                key={index}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  data.isHighlighted ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
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
          data.isHighlighted ? '!bg-red-400' : '!bg-yellow-400'
        }`}
      />
    </div>
  )
}

export default memo(CustomNode)

