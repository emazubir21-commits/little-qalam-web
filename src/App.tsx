import { useState } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { OrderFormSection } from './components/OrderFormSection';
import { ProductCatalog } from './components/ProductCatalog';
import { PRODUCTS, Product } from './data/catalog';

export default function App() {
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    scrollToSection('pesan');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EE] text-[#1B2A27]">
      <Navbar onOrderClick={() => scrollToSection('pesan')} />

      <main className="flex-1">
        <HeroSection
          onExploreCatalog={() => scrollToSection('katalog')}
          onDirectOrder={() => scrollToSection('pesan')}
        />

        <ProductCatalog
          selectedProductId={selectedProductId}
          onSelectProduct={handleSelectProduct}
        />

        <OrderFormSection
          selectedProductId={selectedProductId}
          onChangeProductId={setSelectedProductId}
        />
      </main>

      <Footer />

      <ChatWidget onGoToOrderForm={() => scrollToSection('pesan')} />
    </div>
  );
}
