import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { kasplexTestnet } from './config'
import { CONTRACT_ADDRESS, TODO_LIST_ABI } from './abi'
import { CheckCircle2, Circle, Trash2, Plus, Edit2, Wallet, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const { address, isConnected } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  const [newTaskContent, setNewTaskContent] = useState('')
  const [newTaskCategory, setNewTaskCategory] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<number>(1)
  const [pendingTask, setPendingTask] = useState<{ content: string; category: string; priority: number } | null>(null)
  // Track the hash we're actively watching — reset to undefined before each new write
  const [watchedHash, setWatchedHash] = useState<`0x${string}` | undefined>(undefined)
  const [showConfirmed, setShowConfirmed] = useState(false)

  // Contract Read — never use stale cache so refetch always gets fresh data
  const { data: tasks, refetch: refetchTasks, isLoading: isTasksLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TODO_LIST_ABI,
    functionName: 'getMyTasks',
    account: address,
    query: {
      enabled: isConnected && !!address,
      staleTime: 0,
    }
  })

  // Contract Writes — capture the hash via onSuccess
  const { writeContract, isPending: isWriting } = useWriteContract({
    mutation: {
      onSuccess: (hash) => {
        setWatchedHash(hash)
      }
    }
  })

  // Watch receipt only for the current watchedHash
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: watchedHash,
  })

  // Refetch when transaction succeeds — delayed to give the RPC node time to index
  React.useEffect(() => {
    if (!isTxSuccess || !watchedHash) return

    setShowConfirmed(true)
    setNewTaskContent('')
    setNewTaskCategory('')
    setNewTaskPriority(1)

    // First refetch — short delay
    const t1 = setTimeout(() => { refetchTasks() }, 800)
    // Safety-net second refetch + cleanup
    const t2 = setTimeout(() => {
      refetchTasks()
      setPendingTask(null)
      setWatchedHash(undefined)
      // Hide "confirmed" banner after 3s
      setTimeout(() => setShowConfirmed(false), 3000)
    }, 3500)

    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isTxSuccess, watchedHash])

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskContent.trim()) return

    setPendingTask({ content: newTaskContent, category: newTaskCategory, priority: newTaskPriority })
    setWatchedHash(undefined)   // reset so old isTxSuccess doesn't linger
    setShowConfirmed(false)

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TODO_LIST_ABI,
      functionName: 'createTask',
      args: [newTaskContent, newTaskCategory, newTaskPriority],
    })
  }

  const handleToggleTask = (id: bigint) => {
    setWatchedHash(undefined)
    setShowConfirmed(false)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TODO_LIST_ABI,
      functionName: 'toggleTaskCompletion',
      args: [id],
    })
  }

  const handleDeleteTask = (id: bigint) => {
    setWatchedHash(undefined)
    setShowConfirmed(false)
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: TODO_LIST_ABI,
      functionName: 'deleteTask',
      args: [id],
    })
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <h1>De-Todo</h1>
          {isConnected ? (
            <div className="wallet-info">
              <span className="address">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
              <button className="btn-secondary" onClick={() => disconnect()}>Disconnect</button>
            </div>
          ) : (
            <button 
              className="btn-primary connect-btn" 
              onClick={() => connect({ connector: connectors[0] })}
            >
              <Wallet size={18} />
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {!isConnected ? (
          <div className="empty-state">
            <Wallet size={48} className="empty-icon" />
            <h2>Connect your wallet</h2>
            <p>Please connect your MetaMask to view and manage your tasks on the Kasplex network.</p>
          </div>
        ) : (
          <div className="todo-app">
            <form onSubmit={handleCreateTask} className="create-task-form">
              <input
                type="text"
                placeholder="What needs to be done?"
                value={newTaskContent}
                onChange={(e) => setNewTaskContent(e.target.value)}
                className="task-input"
                disabled={isWriting || isTxConfirming}
              />
              <div className="task-options">
                <input
                  type="text"
                  placeholder="Category (e.g. Work)"
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value)}
                  className="category-input"
                />
                <select 
                  value={newTaskPriority} 
                  onChange={(e) => setNewTaskPriority(Number(e.target.value))}
                  className="priority-select"
                >
                  <option value={1}>Low Priority</option>
                  <option value={2}>Medium Priority</option>
                  <option value={3}>High Priority</option>
                </select>
                <button 
                  type="submit" 
                  className="btn-primary add-btn"
                  disabled={!newTaskContent.trim() || isWriting || isTxConfirming}
                >
                  {isWriting || isTxConfirming ? <Loader2 className="spin" size={18} /> : <Plus size={18} />}
                  Add Task
                </button>
              </div>
            </form>

            {isTxConfirming && <div className="tx-status info">⏳ Transaction pending... waiting for confirmation</div>}
            {showConfirmed && !isTxConfirming && <div className="tx-status success">✅ Transaction confirmed! Refreshing tasks...</div>}

            <div className="task-list">
              {isTasksLoading ? (
                <div className="loading-state">
                  <Loader2 className="spin" size={24} />
                  <span>Loading tasks from blockchain...</span>
                </div>
              ) : (
                <>
                  {/* Optimistic pending task — shown while tx is in-flight AND during post-confirmation refresh */}
                  {pendingTask && (isWriting || isTxConfirming || showConfirmed) && (
                    <div className="task-item pending-optimistic">
                      <button className="toggle-btn" disabled>
                        <Loader2 className="spin icon-pending" size={20} />
                      </button>
                      <div className="task-content">
                        <p className="task-text">{pendingTask.content}</p>
                        <div className="task-meta">
                          {pendingTask.category && <span className="tag category-tag">{pendingTask.category}</span>}
                          <span className={`tag priority-tag p-${pendingTask.priority}`}>
                            {pendingTask.priority === 3 ? 'High' : pendingTask.priority === 2 ? 'Medium' : 'Low'}
                          </span>
                          <span className="tag pending-tag">⏳ Pending...</span>
                        </div>
                      </div>
                      <button className="delete-btn" disabled>
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  {/* Confirmed tasks from blockchain */}
                  {tasks && tasks.length > 0 ? (
                    tasks.map((task: any) => (
                      <div key={task.id.toString()} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <button 
                          className="toggle-btn"
                          onClick={() => handleToggleTask(task.id)}
                          disabled={isWriting || isTxConfirming}
                        >
                          {task.completed ? (
                            <CheckCircle2 className="icon-completed" />
                          ) : (
                            <Circle className="icon-pending" />
                          )}
                        </button>
                        
                        <div className="task-content">
                          <p className="task-text">{task.content}</p>
                          <div className="task-meta">
                            {task.category && <span className="tag category-tag">{task.category}</span>}
                            <span className={`tag priority-tag p-${task.priority}`}>
                              {task.priority === 3 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}
                            </span>
                            <span className="date-tag">
                              {new Date(Number(task.timestamp) * 1000).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteTask(task.id)}
                          disabled={isWriting || isTxConfirming}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))
                  ) : (
                    !pendingTask && !(isWriting || isTxConfirming) && (
                      <div className="empty-state">
                        <CheckCircle2 size={48} className="empty-icon" />
                        <h2>All caught up!</h2>
                        <p>You have no tasks pending.</p>
                      </div>
                    )
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
