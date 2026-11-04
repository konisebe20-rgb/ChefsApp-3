import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Dish = {
  id: string;
  name: string;
  course: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

type Screen =
  | "menu"
  | "add"
  | "edit"
  | "delete"
  | "search"
  | "details"
  | "statistics";

const STARTER_DISHES: Dish[] = [
  {
    id: "1",
    name: "Grilled Chicken",
    course: "Main Course",
    description: "Juicy grilled chicken served with vegetables.",
    price: 100,
    quantity: 10,
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    name: "Pasta",
    course: "Main Course",
    description: "Creamy pasta with herbs and parmesan.",
    price: 85,
    quantity: 15,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    name: "Fresh Salad",
    course: "Starter",
    description: "Fresh greens, tomatoes and a light dressing.",
    price: 60,
    quantity: 20,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    name: "Chicken Curry",
    course: "Main Course",
    description: "Mild chicken curry with fragrant spices.",
    price: 95,
    quantity: 12,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80",
  },
];

const COLORS = {
  background: "#F5F5F3",
  card: "#FFFFFF",
  text: "#202020",
  muted: "#777777",
  line: "#E4E4E1",
  dark: "#202020",
  purple: "#6E56CF",
  danger: "#D9534F",
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const [screen, setScreen] = useState<Screen>("menu");

  const [dishes, setDishes] = useState<Dish[]>(STARTER_DISHES);

  const [selectedDish, setSelectedDish] = useState<Dish | null>(
    STARTER_DISHES[0]
  );

  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  // -----------------------------------------
  // SPLASH SCREEN - 3 SECONDS
  // -----------------------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // -----------------------------------------
  // ADD DISH
  // -----------------------------------------

  const addDish = (dish: Dish) => {
    setDishes((current) => [...current, dish]);

    setSelectedDish(dish);

    setScreen("menu");
  };

  // -----------------------------------------
  // EDIT DISH
  // -----------------------------------------

  const updateDish = (updatedDish: Dish) => {
    setDishes((current) =>
      current.map((dish) =>
        dish.id === updatedDish.id ? updatedDish : dish
      )
    );

    setSelectedDish(updatedDish);

    setEditingDish(null);

    setScreen("details");
  };

  // -----------------------------------------
  // DELETE DISH
  // -----------------------------------------

  const deleteDish = (id: string) => {
    setDishes((current) =>
      current.filter((dish) => dish.id !== id)
    );

    setSelectedDish(null);

    setScreen("menu");
  };

  // -----------------------------------------
  // SHOW SPLASH
  // -----------------------------------------

  if (showSplash) {
    return <SplashScreen />;
  }

  // -----------------------------------------
  // MAIN APP
  // -----------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        
      />

      <View style={styles.appContainer}>

        {/* MENU */}

        {screen === "menu" && (
          <MenuScreen
            dishes={dishes}
            onAdd={() => setScreen("add")}
            onSearch={() => setScreen("search")}
            onStatistics={() => setScreen("statistics")}
            onDishPress={(dish) => {
              setSelectedDish(dish);
              setScreen("details");
            }}
          />
        )}

        {/* ADD */}

        {screen === "add" && (
          <DishForm
            title="Add new dish"
            subtitle="Enter the details of your new dish"
            onCancel={() => setScreen("menu")}
            onSave={addDish}
          />
        )}

        {/* EDIT */}

        {screen === "edit" && editingDish && (
          <DishForm
            title="Edit dish"
            subtitle="Update the dish information"
            initialDish={editingDish}
            onCancel={() => setScreen("details")}
            onSave={updateDish}
          />
        )}

        {/* DELETE */}

        {screen === "delete" && selectedDish && (
          <DeleteScreen
            dish={selectedDish}
            onCancel={() => setScreen("details")}
            onDelete={() => deleteDish(selectedDish.id)}
          />
        )}

        {/* SEARCH */}

        {screen === "search" && (
          <SearchScreen
            dishes={dishes}
            onBack={() => setScreen("menu")}
            onDishPress={(dish) => {
              setSelectedDish(dish);
              setScreen("details");
            }}
          />
        )}

        {/* DETAILS */}

        {screen === "details" && selectedDish && (
          <DetailsScreen
            dish={selectedDish}
            onBack={() => setScreen("menu")}
            onEdit={() => {
              setEditingDish(selectedDish);
              setScreen("edit");
            }}
            onDelete={() => setScreen("delete")}
          />
        )}

        {/* STATISTICS */}

        {screen === "statistics" && (
          <StatisticsScreen
            dishes={dishes}
            onBack={() => setScreen("menu")}
          />
        )}

        {/* BOTTOM NAVIGATION */}

        <BottomNavigation
          screen={screen}
          onMenu={() => setScreen("menu")}
          onSearch={() => setScreen("search")}
          onStatistics={() => setScreen("statistics")}
        />

      </View>
    </SafeAreaView>
  );
}

// =====================================================
// SPLASH SCREEN
// =====================================================

function SplashScreen() {
  return (
    <SafeAreaView style={styles.splashScreen}>

      <View style={styles.splashIcon}>
        <Text style={styles.splashEmoji}>🍽️</Text>
      </View>

      <Text style={styles.splashTitle}>
        Chef's Menu
      </Text>

      <Text style={styles.splashSubtitle}>
        Your dishes. Your menu.
      </Text>

      <View style={styles.loadingBar}>
        <View style={styles.loadingProgress} />
      </View>

      <Text style={styles.loadingText}>
        Loading menu...
      </Text>

    </SafeAreaView>
  );
}

// =====================================================
// HEADER
// =====================================================

function Header({
  title,
  subtitle,
  onBack,
  rightButton,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightButton?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>

      <View style={styles.headerLeft}>

        {onBack && (
          <Pressable
            style={styles.backButton}
            onPress={onBack}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        )}

        <View>
          <Text style={styles.headerTitle}>
            {title}
          </Text>

          {subtitle && (
            <Text style={styles.headerSubtitle}>
              {subtitle}
            </Text>
          )}
        </View>

      </View>

      {rightButton}

    </View>
  );
}

// =====================================================
// MENU SCREEN
// =====================================================

function MenuScreen({
  dishes,
  onAdd,
  onSearch,
  onStatistics,
  onDishPress,
}: {
  dishes: Dish[];
  onAdd: () => void;
  onSearch: () => void;
  onStatistics: () => void;
  onDishPress: (dish: Dish) => void;
}) {
  return (
    <View style={styles.flex}>

      <Header
        title="Chef's Menu"
        subtitle={`${dishes.length} dishes available`}
        rightButton={
          <Pressable
            style={styles.searchIconButton}
            onPress={onSearch}
          >
            <Text style={styles.searchIcon}>
              🔍
            </Text>
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >

        {/* HERO */}

        <View style={styles.heroCard}>

          <View>
            <Text style={styles.heroSmall}>
              TODAY'S MENU
            </Text>

            <Text style={styles.heroTitle}>
              Good food,
              {"\n"}
              made simple.
            </Text>
          </View>

          <Text style={styles.heroEmoji}>
            🍳
          </Text>

        </View>

        {/* SECTION TITLE */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            All dishes
          </Text>

          <Pressable onPress={onStatistics}>
            <Text style={styles.viewStats}>
              View stats
            </Text>
          </Pressable>

        </View>

        {/* DISHES */}

        {dishes.map((dish) => (
          <Pressable
            key={dish.id}
            style={styles.dishCard}
            onPress={() => onDishPress(dish)}
          >

            <Image
              source={{ uri: dish.image }}
              style={styles.dishImage}
            />

            <View style={styles.dishInformation}>

              <Text style={styles.dishName}>
                {dish.name}
              </Text>

              <Text style={styles.dishCourse}>
                {dish.course}
              </Text>

              <Text style={styles.dishDescription}>
                Items available: {dish.quantity}
              </Text>

              <Text
                style={styles.dishDescription}
                numberOfLines={1}
              >
                {dish.description}
              </Text>

            </View>

            <View style={styles.priceContainer}>

              <Text style={styles.price}>
                R{dish.price}
              </Text>

              <Text style={styles.arrow}>
                ›
              </Text>

            </View>

          </Pressable>
        ))}

        {/* ADD BUTTON */}

        <Pressable
          style={styles.primaryButton}
          onPress={onAdd}
        >
          <Text style={styles.primaryButtonText}>
            ＋ Add new dish
          </Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

// =====================================================
// ADD / EDIT FORM
// =====================================================

function DishForm({
  title,
  subtitle,
  initialDish,
  onCancel,
  onSave,
}: {
  title: string;
  subtitle: string;
  initialDish?: Dish;
  onCancel: () => void;
  onSave: (dish: Dish) => void;
}) {
  const [name, setName] = useState(
    initialDish?.name ?? ""
  );

  const [course, setCourse] = useState(
    initialDish?.course ?? "Main Course"
  );

  const [description, setDescription] = useState(
    initialDish?.description ?? ""
  );

  const [price, setPrice] = useState(
    initialDish
      ? String(initialDish.price)
      : ""
  );

  const [quantity, setQuantity] = useState(
    initialDish ? String(initialDish.quantity) : ""
  );

  const [image, setImage] = useState(
    initialDish?.image ?? ""
  );

  const saveDish = () => {

    if (!name.trim()) {
      Alert.alert(
        "Missing dish name",
        "Please enter a dish name."
      );
      return;
    }

    if (!price.trim()) {
      Alert.alert(
        "Missing price",
        "Please enter a price."
      );
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice < 0) {
      Alert.alert(
        "Invalid price",
        "Please enter a valid number."
      );
      return;
    }

    if (!quantity.trim()) {
      Alert.alert("Missing quantity", "Please enter the number of items or portions.");
      return;
    }

    const numericQuantity = Number(quantity);
    if (!Number.isInteger(numericQuantity) || numericQuantity < 0) {
      Alert.alert("Invalid quantity", "Please enter a whole number (0 or more).");
      return;
    }

    const newDish: Dish = {
      id:
        initialDish?.id ??
        Date.now().toString(),

      name: name.trim(),

      course,

      description:
        description.trim() ||
        "No description added.",

      price: numericPrice,

      quantity: numericQuantity,

      image:
        image.trim() ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    };

    onSave(newDish);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >

      <Header
        title={title}
        subtitle={subtitle}
        onBack={onCancel}
      />

      <ScrollView
        contentContainerStyle={styles.formContent}
      >

        {/* PHOTO */}

        <Text style={styles.formLabel}>
          Dish photo
        </Text>

        <View style={styles.photoPreview}>

          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.photoImage}
            />
          ) : (
            <Text style={styles.photoEmoji}>
              🖼️
            </Text>
          )}

        </View>

        {/* IMAGE URL */}

        <Text style={styles.formLabel}>
          Photo URL
        </Text>

        <TextInput
          value={image}
          onChangeText={setImage}
          placeholder="Paste image URL"
          placeholderTextColor="#999"
          style={styles.input}
          autoCapitalize="none"
        />

        {/* NAME */}

        <Text style={styles.formLabel}>
          Dish name
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="e.g. Grilled Chicken"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* COURSE */}

        <Text style={styles.formLabel}>
          Course type
        </Text>

        <View style={styles.courseRow}>

          {[
            "Starter",
            "Main Course",
            "Dessert",
          ].map((item) => (

            <Pressable
              key={item}
              style={[
                styles.courseButton,
                course === item &&
                  styles.courseButtonSelected,
              ]}
              onPress={() => setCourse(item)}
            >

              <Text
                style={[
                  styles.courseText,
                  course === item &&
                    styles.courseTextSelected,
                ]}
              >
                {item}
              </Text>

            </Pressable>

          ))}

        </View>

        {/* DESCRIPTION */}

        <Text style={styles.formLabel}>
          Description
        </Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the dish..."
          placeholderTextColor="#999"
          style={[
            styles.input,
            styles.textArea,
          ]}
          multiline
        />

        {/* PRICE */}

        <Text style={styles.formLabel}>
          Price (R)
        </Text>

        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="100"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="decimal-pad"
        />

        {/* QUANTITY */}

        <Text style={styles.formLabel}>Number of items / portions</Text>
        <TextInput
          value={quantity}
          onChangeText={setQuantity}
          placeholder="e.g. 10"
          placeholderTextColor="#999"
          style={styles.input}
          keyboardType="number-pad"
        />

        {/* SAVE */}

        <Pressable
          style={styles.primaryButton}
          onPress={saveDish}
        >

          <Text style={styles.primaryButtonText}>
            {initialDish
              ? "Save changes"
              : "Add dish"}
          </Text>

        </Pressable>

        {/* CANCEL */}

        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
        >

          <Text style={styles.cancelText}>
            Cancel
          </Text>

        </Pressable>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// =====================================================
// DETAILS SCREEN
// =====================================================

function DetailsScreen({
  dish,
  onBack,
  onEdit,
  onDelete,
}: {
  dish: Dish;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.flex}>

      <Header
        title="Dish details"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.detailsContent}
      >

        <Image
          source={{ uri: dish.image }}
          style={styles.detailsImage}
        />

        <Text style={styles.detailsCourse}>
          {dish.course.toUpperCase()}
        </Text>

        <Text style={styles.detailsName}>
          {dish.name}
        </Text>

        <Text style={styles.detailsPrice}>
          R{dish.price}
        </Text>

        <Text style={styles.detailsDescription}>
          Number of items / portions: {dish.quantity}
        </Text>

        <Text style={styles.detailsDescription}>
          {dish.description}
        </Text>

        <View style={styles.actionRow}>

          <Pressable
            style={styles.editButton}
            onPress={onEdit}
          >
            <Text style={styles.editButtonText}>
              ✎ EDIT
            </Text>
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={onDelete}
          >
            <Text style={styles.deleteButtonText}>
              🗑 DELETE
            </Text>
          </Pressable>

        </View>

      </ScrollView>
    </View>
  );
}

// =====================================================
// DELETE SCREEN
// =====================================================

function DeleteScreen({
  dish,
  onCancel,
  onDelete,
}: {
  dish: Dish;
  onCancel: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.flex}>

      <Header
        title="Delete dish"
        subtitle="This action cannot be undone"
        onBack={onCancel}
      />

      <View style={styles.deleteContent}>

        <View style={styles.trashCircle}>
          <Text style={styles.trashEmoji}>
            🗑️
          </Text>
        </View>

        <Text style={styles.deleteTitle}>
          Delete {dish.name}?
        </Text>

        <Text style={styles.deleteMessage}>
          Are you sure you want to delete
          this dish from your menu?
        </Text>

        <Pressable
          style={styles.dangerButton}
          onPress={onDelete}
        >
          <Text style={styles.dangerButtonText}>
            Yes, delete dish
          </Text>
        </Pressable>

        <Pressable
          style={styles.cancelButton}
          onPress={onCancel}
        >
          <Text style={styles.cancelText}>
            No, keep dish
          </Text>
        </Pressable>

      </View>
    </View>
  );
}

// =====================================================
// SEARCH SCREEN
// =====================================================

function SearchScreen({
  dishes,
  onBack,
  onDishPress,
}: {
  dishes: Dish[];
  onBack: () => void;
  onDishPress: (dish: Dish) => void;
}) {
  const [searchText, setSearchText] =
    useState("");

  const [selectedCourse, setSelectedCourse] =
    useState("All");

  const filteredDishes = useMemo(() => {

    return dishes.filter((dish) => {

      const matchesSearch =
        dish.name
          .toLowerCase()
          .includes(searchText.toLowerCase());

      const matchesCourse =
        selectedCourse === "All" ||
        dish.course === selectedCourse;

      return matchesSearch && matchesCourse;

    });

  }, [dishes, searchText, selectedCourse]);

  return (
    <View style={styles.flex}>

      <Header
        title="Search & filter"
        subtitle="Find dishes by name and course"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search dishes..."
          placeholderTextColor="#999"
          style={styles.searchInput}
        />

        <View style={styles.filterRow}>

          {[
            "All",
            "Starter",
            "Main Course",
            "Dessert",
          ].map((item) => (

            <Pressable
              key={item}
              onPress={() =>
                setSelectedCourse(item)
              }
              style={[
                styles.filterButton,
                selectedCourse === item &&
                  styles.filterButtonSelected,
              ]}
            >

              <Text
                style={[
                  styles.filterText,
                  selectedCourse === item &&
                    styles.filterTextSelected,
                ]}
              >
                {item}
              </Text>

            </Pressable>

          ))}

        </View>

        <Text style={styles.resultText}>
          {filteredDishes.length} result(s)
        </Text>

        {filteredDishes.map((dish) => (

          <Pressable
            key={dish.id}
            style={styles.dishCard}
            onPress={() => onDishPress(dish)}
          >

            <Image
              source={{ uri: dish.image }}
              style={styles.dishImage}
            />

            <View style={styles.dishInformation}>

              <Text style={styles.dishName}>
                {dish.name}
              </Text>

              <Text style={styles.dishCourse}>
                {dish.course}
              </Text>

              <Text style={styles.dishDescription}>
                Items: {dish.quantity}
              </Text>

            </View>

            <Text style={styles.price}>
              R{dish.price}
            </Text>

          </Pressable>

        ))}

        {filteredDishes.length === 0 && (

          <View style={styles.emptyState}>

            <Text style={styles.emptyEmoji}>
              🔍
            </Text>

            <Text style={styles.emptyTitle}>
              No dishes found
            </Text>

            <Text style={styles.emptyText}>
              Try another search.
            </Text>

          </View>

        )}

      </ScrollView>
    </View>
  );
}

// =====================================================
// STATISTICS SCREEN
// =====================================================

function StatisticsScreen({
  dishes,
  onBack,
}: {
  dishes: Dish[];
  onBack: () => void;
}) {
  const totalValue = dishes.reduce(
    (total, dish) =>
      total + dish.price,
    0
  );

  const averagePrice =
    dishes.length > 0
      ? totalValue / dishes.length
      : 0;

  const totalItems = dishes.reduce(
    (total, dish) => total + dish.quantity,
    0
  );

  const mainCourses =
    dishes.filter(
      (dish) =>
        dish.course === "Main Course"
    ).length;

  return (
    <View style={styles.flex}>

      <Header
        title="Statistics"
        subtitle="Menu overview"
        onBack={onBack}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
      >

        <View style={styles.statsGrid}>

          <StatCard
            icon="🍽️"
            value={String(dishes.length)}
            label="Total dishes"
          />

          <StatCard
            icon="🥘"
            value={String(mainCourses)}
            label="Main courses"
          />

          <StatCard
            icon="📦"
            value={String(totalItems)}
            label="Total items / portions"
          />

          <StatCard
            icon="💰"
            value={`R${averagePrice.toFixed(2)}`}
            label="Average price"
          />

          <StatCard
            icon="📊"
            value={`R${totalValue}`}
            label="Menu value"
          />

        </View>

        <View style={styles.overviewCard}>

          <Text style={styles.sectionTitle}>
            Course breakdown
          </Text>

          {[
            "Starter",
            "Main Course",
            "Dessert",
          ].map((course) => {

            const count =
              dishes.filter(
                (dish) =>
                  dish.course === course
              ).length;

            const percentage =
              dishes.length > 0
                ? count / dishes.length
                : 0;

            return (
              <View
                key={course}
                style={styles.barItem}
              >

                <View style={styles.barHeader}>

                  <Text style={styles.barLabel}>
                    {course}
                  </Text>

                  <Text style={styles.barValue}>
                    {count}
                  </Text>

                </View>

                <View style={styles.barTrack}>

                  <View
                    style={[
                      styles.barFill,
                      {
                        width:
                          `${percentage * 100}%`,
                      },
                    ]}
                  />

                </View>

              </View>
            );
          })}

        </View>

      </ScrollView>
    </View>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>

      <Text style={styles.statIcon}>
        {icon}
      </Text>

      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>

    </View>
  );
}

// =====================================================
// BOTTOM NAVIGATION
// =====================================================

function BottomNavigation({
  screen,
  onMenu,
  onSearch,
  onStatistics,
}: {
  screen: Screen;
  onMenu: () => void;
  onSearch: () => void;
  onStatistics: () => void;
}) {
  return (
    <View style={styles.bottomNavigation}>

      <NavItem
        icon="⌂"
        label="Menu"
        active={
          screen === "menu" ||
          screen === "details"
        }
        onPress={onMenu}
      />

      <NavItem
        icon="⌕"
        label="Search"
        active={screen === "search"}
        onPress={onSearch}
      />

      <NavItem
        icon="▥"
        label="Stats"
        active={screen === "statistics"}
        onPress={onStatistics}
      />

    </View>
  );
}

// =====================================================
// NAV ITEM
// =====================================================

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.navItem}
      onPress={onPress}
    >

      <Text
        style={[
          styles.navIcon,
          active && styles.navActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.navLabel,
          active && styles.navActive,
        ]}
      >
        {label}
      </Text>

    </Pressable>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  appContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    padding: 18,
    paddingBottom: 110,
  },

  // SPLASH

  splashScreen: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
  },

  splashIcon: {
    width: 85,
    height: 85,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  splashEmoji: {
    fontSize: 42,
  },

  splashTitle: {
    color: "#FFFFFF",
    fontSize: 30,
    fontWeight: "900",
  },

  splashSubtitle: {
    color: "#BBBBBB",
    marginTop: 6,
    fontSize: 14,
  },

  loadingBar: {
    width: 180,
    height: 5,
    backgroundColor: "#444444",
    borderRadius: 5,
    marginTop: 35,
    overflow: "hidden",
  },

  loadingProgress: {
    width: "65%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },

  loadingText: {
    color: "#999999",
    marginTop: 10,
    fontSize: 12,
  },

  // HEADER

  header: {
    minHeight: 76,
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  backText: {
    fontSize: 30,
    color: COLORS.text,
    lineHeight: 30,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 2,
  },

  searchIconButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
  },

  searchIcon: {
    fontSize: 18,
  },

  // HERO

  heroCard: {
    backgroundColor: COLORS.dark,
    borderRadius: 22,
    padding: 22,
    minHeight: 155,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  heroSmall: {
    color: "#AAAAAA",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  heroTitle: {
    color: "#FFFFFF",
    fontSize: 27,
    fontWeight: "900",
    lineHeight: 32,
    marginTop: 7,
  },

  heroEmoji: {
    fontSize: 65,
  },

  // SECTION

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },

  viewStats: {
    color: COLORS.purple,
    fontWeight: "800",
    fontSize: 13,
  },

  // DISH CARD

  dishCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEEEEB",
  },

  dishImage: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: "#E8E8E5",
  },

  dishInformation: {
    flex: 1,
    paddingHorizontal: 12,
  },

  dishName: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },

  dishCourse: {
    fontSize: 11,
    color: COLORS.purple,
    fontWeight: "800",
    marginTop: 3,
  },

  dishDescription: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 5,
  },

  priceContainer: {
    alignItems: "flex-end",
  },

  price: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
  },

  arrow: {
    fontSize: 24,
    color: "#AAAAAA",
  },

  // BUTTON

  primaryButton: {
    backgroundColor: COLORS.dark,
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  // FORM

  formContent: {
    padding: 18,
    paddingBottom: 120,
  },

  formLabel: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 12,
    marginBottom: 7,
  },

  input: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 14,
    color: COLORS.text,
    fontSize: 14,
  },

  textArea: {
    minHeight: 100,
    paddingTop: 13,
    textAlignVertical: "top",
  },

  photoPreview: {
    height: 160,
    borderRadius: 16,
    backgroundColor: "#E9E9E6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  photoImage: {
    width: "100%",
    height: "100%",
  },

  photoEmoji: {
    fontSize: 45,
  },

  courseRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },

  courseButton: {
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: COLORS.card,
  },

  courseButtonSelected: {
    backgroundColor: COLORS.dark,
    borderColor: COLORS.dark,
  },

  courseText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "800",
  },

  courseTextSelected: {
    color: "#FFFFFF",
  },

  cancelButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: COLORS.muted,
    fontWeight: "800",
  },

  // DETAILS

  detailsContent: {
    padding: 18,
    paddingBottom: 120,
  },

  detailsImage: {
    width: "100%",
    height: 260,
    borderRadius: 22,
    backgroundColor: "#E8E8E5",
  },

  detailsCourse: {
    fontSize: 11,
    color: COLORS.purple,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 20,
  },

  detailsName: {
    fontSize: 32,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 5,
  },

  detailsPrice: {
    fontSize: 21,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 7,
  },

  detailsDescription: {
    fontSize: 14,
    color: COLORS.muted,
    lineHeight: 21,
    marginTop: 16,
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 25,
  },

  editButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: COLORS.dark,
    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
    fontWeight: "900",
    color: COLORS.dark,
  },

  deleteButton: {
    flex: 1,
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: "#FDEDEC",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButtonText: {
    fontWeight: "900",
    color: COLORS.danger,
  },

  // DELETE

  deleteContent: {
    flex: 1,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 120,
  },

  trashCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#FDEDEC",
    alignItems: "center",
    justifyContent: "center",
  },

  trashEmoji: {
    fontSize: 40,
  },

  deleteTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 22,
    textAlign: "center",
  },

  deleteMessage: {
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
    maxWidth: 310,
  },

  dangerButton: {
    width: "100%",
    minHeight: 52,
    borderRadius: 14,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  dangerButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },

  // SEARCH

  searchInput: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 13,
    height: 50,
    paddingHorizontal: 15,
    color: COLORS.text,
    fontSize: 14,
  },

  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 13,
  },

  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.line,
  },

  filterButtonSelected: {
    backgroundColor: COLORS.dark,
    borderColor: COLORS.dark,
  },

  filterText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.text,
  },

  filterTextSelected: {
    color: "#FFFFFF",
  },

  resultText: {
    color: COLORS.muted,
    fontSize: 12,
    marginVertical: 16,
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 55,
  },

  emptyEmoji: {
    fontSize: 45,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },

  emptyText: {
    color: COLORS.muted,
    marginTop: 5,
  },

  // STATISTICS

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statCard: {
    width: "48%",
    backgroundColor: COLORS.card,
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: "#EEEEEB",
  },

  statIcon: {
    fontSize: 23,
  },

  statValue: {
    fontSize: 25,
    fontWeight: "900",
    marginTop: 8,
    color: COLORS.text,
  },

  statLabel: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
  },

  overviewCard: {
    backgroundColor: COLORS.card,
    borderRadius: 17,
    padding: 18,
    marginTop: 12,
  },

  barItem: {
    marginTop: 18,
  },

  barHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  barLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
  },

  barValue: {
    fontSize: 12,
    color: COLORS.muted,
  },

  barTrack: {
    height: 8,
    backgroundColor: "#ECECE9",
    borderRadius: 5,
    overflow: "hidden",
  },

  barFill: {
    height: "100%",
    backgroundColor: COLORS.purple,
    borderRadius: 5,
  },

  // BOTTOM NAVIGATION

  bottomNavigation: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 10,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: "#E7E7E3",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  navIcon: {
    fontSize: 21,
    color: "#999999",
  },

  navLabel: {
    fontSize: 10,
    color: "#999999",
    marginTop: 2,
    fontWeight: "800",
  },

  navActive: {
    color: COLORS.dark,
  },

});