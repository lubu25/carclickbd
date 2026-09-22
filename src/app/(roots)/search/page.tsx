"use client";
import ProductCard from "@/components/publiclayout/home/AcutionProducts/ProductCard";
import { useSearchResultQuery } from "@/Redux/api/productApi";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import Container from "@/shared/wrapper/Container";
import NoDatafound from "@/shared/ui/NoDatafound";
import { Button, Col, Row } from "antd";
import { IProduct } from "@/Interface/product";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const title = searchParams.get("title");

    const filters = useMemo(() => {
        const baseFilters: { name: string; value?: any }[] = [];
        if (searchParams.get("title"))
            baseFilters.push({ name: "searchTerm", value: searchParams.get("title") }); // এখানে 'title' এর পরিবর্তে 'searchTerm' ব্যবহার করা হয়েছে
        return baseFilters;
    }, [searchParams]);

    const { data, isLoading, error } = useSearchResultQuery(filters);
    const products: IProduct[] = useMemo(() => data?.data || [], [data]);

    if (isLoading) {
        return (
            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
                {[...Array(8)].map((_, index) => (
                    <Col key={index} xs={24} sm={12} md={8} lg={6}>
                        <ProductCard.Skeleton />
                    </Col>
                ))}
            </Row>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl italic font-bold pb-2">
                    Results for <span className="text-primary">{title}</span>{" "}
                    <p>Not found product</p>
                </h2>
                <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => (window.location.href = "/")}
                >
                    Go to Home
                </Button>
            </div>
        );
    }

    return (
        <Container className="py-8 min-h-screen">
            <h2 className="text-2xl italic font-bold pb-2">
                Results for <span className="text-primary">{title}</span>{" "}
            </h2>
            {products.length > 0 ? (
                <section className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
                    {products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </section>
            ) : (
                <div className="p-4 mt-4">
                    <NoDatafound />
                </div>
            )}
        </Container>
    );
};

export default SearchPage;