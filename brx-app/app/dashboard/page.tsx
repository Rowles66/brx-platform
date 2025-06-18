"use client"

// Imports remain the same as your last synced version
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarIcon,
  Settings2,
  UserCircle,
  CalendarCheck2,
  Heart,
  Mail,
  FileTextIcon,
  Star,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { trpc } from "@/lib/trpc/client"

// Interfaces and helper components (StatOverviewCard, LoadingSkeleton, TableSkeleton, actionIcons, workoutActionIcons)
// remain the same as your last synced version, preserving any color changes within them.
// For brevity, I'll only show the StatOverviewCard to demonstrate color preservation.

interface StatData {
  title: string
  value: number
  color: "green" | "red"
  viewAllLink: string
}

const StatOverviewCard = ({ title, value, color, viewAllLink }: StatData) => {
  const badgeColorClass =
    color === "green" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          {/* Preserving Cursor's color change, e.g., text-orange-500 */}
          <Link href={viewAllLink} className="text-xs text-orange-500 hover:text-orange-600">
            view all
          </Link>
        </div>
        <Badge variant="outline" className={`text-sm font-semibold px-2.5 py-1 ${badgeColorClass}`}>
          {value.toLocaleString()}
        </Badge>
      </CardContent>
    </Card>
  )
}

const actionIcons = [
  { icon: Settings2, label: "Settings" },
  { icon: UserCircle, label: "Profile" },
  { icon: CalendarCheck2, label: "Calendar" },
  { icon: Heart, label: "Favorites" },
  { icon: Mail, label: "Message" },
]

const workoutActionIcons = [
  { icon: FileTextIcon, label: "Details" },
  { icon: Star, label: "Favorite" },
  { icon: BarChart3, label: "Stats" },
  { icon: Mail, label: "Share" },
]

const LoadingSkeleton = ({ count = 1, height = "h-24" }: { count?: number; height?: string }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`bg-gray-200 rounded-md animate-pulse ${height}`} />
    ))}
  </>
)

const TableSkeleton = ({ rows = 3, cols = 2 }: { rows?: number; cols?: number }) => (
  <div className="space-y-2 mt-4">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-2">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <div key={colIndex} className="h-8 bg-gray-200 rounded animate-pulse flex-1" />
        ))}
      </div>
    ))}
  </div>
)

export default function DashboardPage() {
  const { data: statsData, isLoading: isLoadingStats } = trpc.dashboard.getStats.useQuery()
  const { data: recentClientsData, isLoading: isLoadingClients } = trpc.dashboard.getRecentClients.useQuery()
  const { data: loggedWorkoutsData, isLoading: isLoadingWorkouts } = trpc.dashboard.getLoggedWorkouts.useQuery()
  const { data: summaryData, isLoading: isLoadingSummary } = trpc.dashboard.getDashboardSummary.useQuery()

  return (
    <>
      <div className="p-6 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard View</h1>
            {/* Preserving Cursor's color change, e.g., text-orange-500 */}
            <Link href="#" className="text-sm text-orange-500 hover:text-orange-600">
              Edit Dashboard View
            </Link>
          </div>
          <div className="flex items-center text-sm text-gray-600 mt-2 sm:mt-0">
            {isLoadingSummary ? (
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mr-2" />
            ) : (
              <span className="mr-2">This Week: {summaryData?.dateRange}</span>
            )}
            <CalendarIcon className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoadingStats ? (
            <LoadingSkeleton count={11} height="h-[92px]" />
          ) : statsData && Array.isArray(statsData) ? ( // THE FIX
            statsData.map((stat) => <StatOverviewCard key={stat.title} {...stat} />)
          ) : (
            <div className="col-span-full text-center text-gray-500 py-4">No stats data available.</div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">Recent Clients</CardTitle>
              {/* Preserving Cursor's color change, e.g., text-orange-500 */}
              <Link href="#" className="text-sm text-orange-500 hover:text-orange-600">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingClients ? (
                <TableSkeleton rows={3} cols={2} />
              ) : recentClientsData && Array.isArray(recentClientsData) ? ( // THE FIX
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Client Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentClientsData.map((client) => (
                        <tr key={client.id}>
                          {/* Preserving Cursor's color change, e.g., text-brandOrange-DEFAULT */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brandOrange-DEFAULT hover:underline">
                            <Link href="#">{client.name}</Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {actionIcons.map((action) => (
                                <Button
                                  key={action.label}
                                  variant="ghost"
                                  size="icon"
                                  // Preserving Cursor's color change, e.g., hover:text-orange-500
                                  className="h-7 w-7 text-gray-400 hover:text-orange-500"
                                >
                                  <action.icon className="h-4 w-4" />
                                  <span className="sr-only">{action.label}</span>
                                </Button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No recent clients to display.</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">Recently Logged Workouts</CardTitle>
              {/* Preserving Cursor's color change, e.g., text-orange-500 */}
              <Link href="#" className="text-sm text-orange-500 hover:text-orange-600">
                View All
              </Link>
            </CardHeader>
            <CardContent>
              {isLoadingWorkouts ? (
                <TableSkeleton rows={3} cols={3} />
              ) : loggedWorkoutsData && Array.isArray(loggedWorkoutsData) ? ( // THE FIX
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Last Logged Workout
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {loggedWorkoutsData.map((workout) => (
                        <tr key={workout.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {workout.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workout.date}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              {workoutActionIcons.map((action) => (
                                <Button
                                  key={action.label}
                                  variant="ghost"
                                  size="icon"
                                  // Preserving Cursor's color change, e.g., hover:text-orange-500
                                  className="h-7 w-7 text-gray-400 hover:text-orange-500"
                                >
                                  <action.icon className="h-4 w-4" />
                                  <span className="sr-only">{action.label}</span>
                                </Button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">No recently logged workouts to display.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
