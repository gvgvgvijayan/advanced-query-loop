<?php
/**
 * Manage parsing the meta query information
 */

namespace AdvancedQueryLoop\Traits;

trait Tax_Query {

	public function process_tax_query() {
		$this->custom_args['tax_query'] = $this->parse_tax_query( $this->custom_params['tax_query'] );
	}

	public function parse_tax_query( $queries ) {
		$tax_query = [];
		// Handle the relation parameter.
		if ( isset( $queries['relation'] ) && count( $queries['queries'] ) > 1 ) {
			$tax_query['relation'] = $queries['relation'];
		}

		// Create the array for the queries
		// Loop the queries
		foreach ( $queries['queries'] as $query ) {
			if ( isset( $query['taxonomy'] ) && isset( $query['terms'] ) && count( $query['terms'] ) > 0 ) {
				$new_item          = array_filter( $query, fn( $key ) => 'id' !== $key, ARRAY_FILTER_USE_KEY );
				$new_item['terms'] = [ ...array_map( fn( $term ) => get_term_by( 'name', $term, $query['taxonomy'] )->term_id, $query['terms'] ) ];
				$tax_query[]       = $new_item;
			}
		}
		// Let's not return empty arrays.
		return array_filter( $tax_query );
	}
}
