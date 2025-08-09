// Dashboard.tsx - Enhanced with comprehensive null checking
import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShoppingCart, Package, Users } from "lucide-react";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

interface User {
  _id: string;
  firstName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Order {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    email: string;
  } | null; // ✅ Make userId nullable
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface CartItem {
  userId: {
    _id: string;
    firstName: string;
    email: string;
  } | null; // ✅ Make userId nullable
  items: Array<{
    productId: {
      Product_name: string;
      Product_price: number;
    } | null; // ✅ Make productId nullable too
    quantity: number;
  }>;
  updatedAt: string;
}

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [carts, setCarts] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const adminToken = localStorage.getItem("admin_token");
      
      if (!adminToken) {
        throw new Error("No admin token found");
      }

      const headers = {
        Authorization: `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      };

      const [usersRes, ordersRes, cartsRes] = await Promise.all([
        axios.get(`${API_URL}/admin/users`, { headers }),
        axios.get(`${API_URL}/admin/orders`, { headers }),
        axios.get(`${API_URL}/admin/carts`, { headers }),
      ]);

      // ✅ Enhanced data validation and filtering
      const validUsers = Array.isArray(usersRes.data.users) 
        ? usersRes.data.users.filter((user: any) => user && user._id && user.firstName) 
        : [];
      
      const validOrders = Array.isArray(ordersRes.data.orders) 
        ? ordersRes.data.orders.filter((order: any) => order && order._id)
        : [];
      
      const validCarts = Array.isArray(cartsRes.data.carts) 
        ? cartsRes.data.carts.filter((cart: any) => cart && cart.userId)
        : [];

      console.log('✅ Dashboard data loaded:', {
        users: validUsers.length,
        orders: validOrders.length,
        carts: validCarts.length
      });

      setUsers(validUsers);
      setOrders(validOrders);
      setCarts(validCarts);
      
    } catch (error: any) {
      console.error('❌ Dashboard fetch error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <p className="text-xs text-gray-500">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders?.filter(order => order?.status?.toLowerCase() === 'pending').length || 0}
            </div>
            <p className="text-xs text-gray-500">Orders in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Carts</CardTitle>
            <ShoppingCart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{carts?.length || 0}</div>
            <p className="text-xs text-gray-500">Users with items in cart</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.slice(0, 5).map((order) => {
                  // ✅ Skip orders with null/invalid data
                  if (!order || !order._id) return null;

                  return (
                    <TableRow key={order._id}>
                      <TableCell>
                        <div>
                          {/* ✅ FIXED: Proper null checking */}
                          <div className="font-medium">
                            {order.userId?.firstName || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.userId?.email || 'No email available'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
                      <TableCell>₹{order.totalAmount || 0}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Unknown'}
                      </TableCell>
                    </TableRow>
                  );
                }).filter(Boolean) // Remove null entries
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Active Carts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Shopping Carts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts && carts.length > 0 ? (
                carts.slice(0, 5).map((cart) => {
                  // ✅ Skip carts with null/invalid data
                  if (!cart || !cart.userId?._id) return null;

                  return (
                    <TableRow key={cart.userId._id}>
                      <TableCell>
                        <div>
                          {/* ✅ FIXED: Proper null checking */}
                          <div className="font-medium">
                            {cart.userId?.firstName || 'Unknown Customer'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {cart.userId?.email || 'No email available'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{cart.items?.length || 0} items</TableCell>
                      <TableCell>
                        ₹{cart.items?.reduce((total, item) => {
                          // ✅ Safe calculation with null checks
                          const price = item?.productId?.Product_price || 0;
                          const quantity = item?.quantity || 0;
                          return total + (price * quantity);
                        }, 0) || 0}
                      </TableCell>
                      <TableCell>
                        {cart.updatedAt ? new Date(cart.updatedAt).toLocaleDateString() : 'Unknown'}
                      </TableCell>
                    </TableRow>
                  );
                }).filter(Boolean) // Remove null entries
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No active carts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
