import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the Order type
export interface Order {
  id: string;
  items: any[];
  totalAmount: number;
  createdAt: string;
  status: string;
  [key: string]: any; // extensibility
}

// Define the shape of the context
interface OrderContextType {
  orders: Order[];
  addOrder: (newOrder: Order) => void;
  clearOrders: () => void;
}

// Create context with default values
export const OrderContext = createContext<OrderContextType>({
  orders: [],
  addOrder: () => {},
  clearOrders: () => {},
});

// Provider component
interface Props {
  children: ReactNode;
}

export const OrderProvider = ({ children }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const stored = await AsyncStorage.getItem('user_orders');
        if (stored) {
          setOrders(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      }
    };
    loadOrders();
  }, []);

  // Persist orders on change
  useEffect(() => {
    AsyncStorage.setItem('user_orders', JSON.stringify(orders)).catch((err) =>
      console.error('Failed to save orders:', err)
    );
  }, [orders]);

  // Add a new order
  const addOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  // Clear all orders
  const clearOrders = () => {
    setOrders([]);
    AsyncStorage.removeItem('user_orders');
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

// ✅ Custom hook to use the context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
