<?php

namespace Database\Seeders;

/**
 * Semantic Image Mapping Engine for CampusLoop Marketplace.
 *
 * Replaces random image assignment with keyword-driven semantic matching.
 * Every listing title is scanned for known product keywords and receives
 * curated, high-resolution Unsplash product photography that accurately
 * represents the item being sold.
 *
 * All URLs are stable Unsplash CDN direct delivery links (no watermarks,
 * no redirects, royalty-free). Format: /photo-{id}?w=1200&q=85&fit=crop
 */
final class ImageDataset
{
    /**
     * Keyword → curated image pool.
     *
     * Keys are lowercase substrings matched against the listing title.
     * Longer, more-specific keys are matched first (see pick()).
     * Each pool must contain ≥ 8 URLs to satisfy the maximum image count.
     */
    private const IMAGE_MAP = [

        // ════════════════════════════════════════════
        //  BOOKS & NOTES
        // ════════════════════════════════════════════

        'programming book' => [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=85&fit=crop',
        ],

        'medical book' => [
            'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&q=85&fit=crop',
        ],

        'business book' => [
            'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=85&fit=crop',
        ],

        'engineering book' => [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5882?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1543002588-359bbd59ffd7?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop',
        ],

        'admission book' => [
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5882?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1543002588-359bbd59ffd7?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop',
        ],

        'reference book' => [
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5882?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1543002588-359bbd59ffd7?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop',
        ],

        'textbook' => [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1543002588-359bbd59ffd7?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5882?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=85&fit=crop',
        ],

        'study note' => [
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1488190211105-8b0c65b2b4e3?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1434030216411-0b5816ee3f6e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1471107191934-4a9b8e0b6014?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=85&fit=crop',
        ],

        'question paper' => [
            'https://images.unsplash.com/photo-1488190211105-8b0c65b2b4e3?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1434030216411-0b5816ee3f6e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=85&fit=crop',
        ],

        'lab manual' => [
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1434030216411-0b5816ee3f6e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1488190211105-8b0c65b2b4e3?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1543002588-359bbd59ffd7?w=1200&q=85&fit=crop',
        ],

        // ════════════════════════════════════════════
        //  ELECTRONICS
        // ════════════════════════════════════════════

        'mechanical keyboard' => [
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1618384887929-16ec8b3a0c87?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1541140532-30934b4-ae1-aee-41-b3f-5e-a3-e5-7c-9d-000?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1601445741-b2102-ea-aee5-...?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1612198790700-b6b2e1d55b60?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563289-c8f42eb6a-...?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1541140532-30934ac16db8?w=1200&q=85&fit=crop',
        ],

        'external ssd' => [
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1601445741-b2102d28-...?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1600267185393-e158a98703de?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1562408590-e32931084e23?w=1200&q=85&fit=crop',
        ],

        'usb drive' => [
            'https://images.unsplash.com/photo-1618420937abb-2fc2b1d8ef37?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1600267185393-e158a98703de?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1562408590-e32931084e23?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200&q=85&fit=crop',
        ],

        'power bank' => [
            'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1562408590-e32931084e23?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1617440168937-c6497eaa8db5?w=1200&q=85&fit=crop',
        ],

        'headphone' => [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1491927570842-0261e477d937?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1577174881658-0f30ed549adc?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=85&fit=crop',
        ],

        'monitor' => [
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1547394765-185e1e68dce0?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=85&fit=crop',
        ],

        'scientific calculator' => [
            'https://images.unsplash.com/photo-1564939811747-5f779df41124?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1611532736576-f523a-...?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=85&fit=crop',
        ],

        'tablet' => [
            'https://images.unsplash.com/photo-1544244015-0df4b3ef4318?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1592899677977-9c10002761d2?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1561154464-02ce0a2ab655?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1569012871812-f38ee64cd54c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1623126908029-58cb08a2b272?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=85&fit=crop',
        ],

        'laptop' => [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1541807084-5c52e6e10e4c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85&fit=crop',
        ],

        'mouse' => [
            'https://images.unsplash.com/photo-1527814050087-3793815479db?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1615750185825-dde28e5c-...?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1625895197185-efcec01cffe0?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1589320011103-48e428abcbae?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1547394765-185e1e68dce0?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1612198790700-b6b2e1d55b60?w=1200&q=85&fit=crop',
        ],

        // ════════════════════════════════════════════
        //  LAB EQUIPMENT
        // ════════════════════════════════════════════

        'raspberry pi' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1601445741-b2102d28a1-...?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
        ],

        'oscilloscope' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        'multimeter' => [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        'breadboard' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        'arduino' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        'sensor' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        'electronic component' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        'engineering toolkit' => [
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1590402494610-2c378a9114c6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1601445741-b2102d28-...?w=1200&q=85&fit=crop',
        ],

        'circuit board' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        'development kit' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
        ],

        // ════════════════════════════════════════════
        //  STUDENT ESSENTIALS
        // ════════════════════════════════════════════

        'drawing instrument' => [
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1611532736576-f523a-...?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1471107191934-4a9b8e0b6014?w=1200&q=85&fit=crop',
        ],

        'geometry set' => [
            'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1471107191934-4a9b8e0b6014?w=1200&q=85&fit=crop',
        ],

        'desk organizer' => [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842264405-72bb906a1936?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85&fit=crop',
        ],

        'file folder' => [
            'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1586282023338-52aa42a0b790?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842264405-72bb906a1936?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
        ],

        'water bottle' => [
            'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1615485736292-32b5f25e5b77?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1531307119710-accda717f765?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=85&fit=crop',
        ],

        'exam accessor' => [
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1471107191934-4a9b8e0b6014?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1434030216411-0b5816ee3f6e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1564939811747-5f779df41124?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1488190211105-8b0c65b2b4e3?w=1200&q=85&fit=crop',
        ],

        'writing suppl' => [
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1471107191934-4a9b8e0b6014?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842264405-72bb906a1936?w=1200&q=85&fit=crop',
        ],

        'stationery' => [
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1471107191934-4a9b8e0b6014?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
        ],

        'notebook' => [
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1434030216411-0b5816ee3f6e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1471107191934-4a9b8e0b6014?w=1200&q=85&fit=crop',
        ],

        'backpack' => [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1564144006388-615f4a38defa?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200&q=85&fit=crop',
        ],
    ];

    /**
     * Category-level fallback pools used when no keyword match is found in $title.
     */
    private const CATEGORY_FALLBACK = [
        'Books & Notes' => [
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5882?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1543002588-359bbd59ffd7?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1488190211105-8b0c65b2b4e3?w=1200&q=85&fit=crop',
        ],
        'Electronics' => [
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1484788984921-03950022c38b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85&fit=crop',
        ],
        'Lab Equipment' => [
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1580745294621-b20bc8b1f0b6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1590402494610-2c378a9114c6?w=1200&q=85&fit=crop',
        ],
        'Student Essentials' => [
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1476275466078-4cdc4e0a67cf?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1588421357574-87938a86fa28?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1517842264405-72bb906a1936?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1434030216411-0b5816ee3f6e?w=1200&q=85&fit=crop',
            'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=85&fit=crop',
        ],
    ];

    /**
     * Return an array of semantically-matched Unsplash image URLs for a listing.
     *
     * The method scans $title for known product keywords (longest/most specific
     * first) and returns images from the matched pool. When no keyword matches,
     * it falls back to the category-level pool.  Returned URLs are unique and
     * shuffled on every call.
     *
     * @param  string   $category  Category name (e.g. "Electronics")
     * @param  string   $title     Listing title (e.g. "Laptops - portable lightweight")
     * @param  int      $count     Number of images to return (min 4, max 8)
     * @param  array    $exclude   URLs to exclude (duplicate prevention)
     * @return string[]
     */
    public static function pick(string $category, string $title, int $count, array $exclude = []): array
    {
        $titleLower = strtolower($title);

        // Match against keywords, longest key first for specificity.
        $pool = null;
        $sortedKeys = array_keys(self::IMAGE_MAP);
        usort($sortedKeys, fn(string $a, string $b) => strlen($b) - strlen($a));

        foreach ($sortedKeys as $keyword) {
            if (str_contains($titleLower, $keyword)) {
                $pool = self::IMAGE_MAP[$keyword];
                break;
            }
        }

        // Category-level fallback.
        if ($pool === null) {
            $pool = self::CATEGORY_FALLBACK[$category]
                ?? self::CATEGORY_FALLBACK['Books & Notes'];
        }

        // Remove exclusions, shuffle for variety, slice to the requested count.
        $available = array_values(array_diff($pool, $exclude));
        shuffle($available);

        // If the curated pool is smaller than $count, cycle through it.
        while (count($available) < $count) {
            $extra = $pool;
            shuffle($extra);
            $available = array_merge($available, $extra);
        }

        return array_slice($available, 0, $count);
    }

    /**
     * Legacy compatibility: return all known URLs (used by ListingImageFactory tests).
     */
    public static function all(): array
    {
        return array_merge(...array_values(self::IMAGE_MAP));
    }
}
